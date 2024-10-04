use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod based_agent {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        bonding_curve_percentage: u8,
        contributor_pool_percentage: u8,
        agent_metadata: AgentMetadata,
    ) -> Result<()> {
        require!(
            bonding_curve_percentage >= 50 && bonding_curve_percentage <= 80,
            ErrorCode::InvalidAllocation
        );
        require!(
            contributor_pool_percentage <= 30,
            ErrorCode::InvalidAllocation
        );
        require!(
            bonding_curve_percentage + contributor_pool_percentage == 80,
            ErrorCode::InvalidAllocation
        );

        let ai_agent = &mut ctx.accounts.ai_agent;
        ai_agent.admin = ctx.accounts.admin.key();
        ai_agent.name = name;
        ai_agent.symbol = symbol;
        ai_agent.token_mint = ctx.accounts.token_mint.key();
        ai_agent.total_supply = 100_000_000 * 10u64.pow(9); // 100 million tokens with 9 decimals
        ai_agent.tokens_on_curve = (ai_agent.total_supply * bonding_curve_percentage as u64) / 100;
        ai_agent.tokens_for_liquidity = ai_agent.total_supply / 5; // 20% reserved for liquidity
        ai_agent.tokens_for_contributor_pool = (ai_agent.total_supply * contributor_pool_percentage as u64) / 100;
        ai_agent.v_sol = 1 * 10u64.pow(9); // Initial virtual SOL reserve
        ai_agent.v_token = 131_449_006_116u64; // Initial virtual token reserve
        ai_agent.sol_raised = 0;
        ai_agent.tokens_sold = 0;
        ai_agent.curve_completed = false;
        ai_agent.vesting_start_time = Clock::get()?.unix_timestamp;
        ai_agent.vesting_duration = 86_400 * 1000; // 1000 days in seconds
        ai_agent.last_vesting_claim_time = ai_agent.vesting_start_time;
        ai_agent.paused = false;
        ai_agent.agent_metadata = agent_metadata;

        Ok(())
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>, sol_amount: u64) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        require!(!ai_agent.paused, ErrorCode::ContractPaused);
        require!(!ai_agent.curve_completed, ErrorCode::CurveCompleted);

        let tokens_to_buy = calculate_tokens_to_receive(sol_amount, ai_agent.v_sol, ai_agent.v_token);
        require!(tokens_to_buy > 0, ErrorCode::InsufficientPurchase);
        require!(
            ai_agent.tokens_sold + tokens_to_buy <= ai_agent.tokens_on_curve,
            ErrorCode::ExceedsAvailableTokens
        );

        // Transfer SOL from buyer to the contract
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.ai_agent.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, sol_amount)?;

        // Mint tokens to the buyer
        let seeds = &[
            ai_agent.to_account_info().key.as_ref(),
            &[*ctx.bumps.get("ai_agent").unwrap()],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.buyer_token_account.to_account_info(),
            authority: ai_agent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, tokens_to_buy)?;

        // Update state
        ai_agent.v_sol += sol_amount;
        ai_agent.v_token -= tokens_to_buy;
        ai_agent.sol_raised += sol_amount;
        ai_agent.tokens_sold += tokens_to_buy;

        // Check if curve is completed
        if ai_agent.tokens_sold == ai_agent.tokens_on_curve {
            ai_agent.curve_completed = true;
            // Trigger liquidity pool creation
            create_liquidity_pool(ctx)?;
        }

        Ok(())
    }

    pub fn sell_tokens(ctx: Context<SellTokens>, token_amount: u64) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        require!(!ai_agent.paused, ErrorCode::ContractPaused);
        require!(!ai_agent.curve_completed, ErrorCode::CurveCompleted);

        let sol_to_receive = calculate_sol_to_receive(token_amount, ai_agent.v_sol, ai_agent.v_token);
        require!(sol_to_receive > 0, ErrorCode::InsufficientSale);

        // Burn tokens from seller
        let cpi_accounts = token::Burn {
            mint: ctx.accounts.token_mint.to_account_info(),
            from: ctx.accounts.seller_token_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, token_amount)?;

        // Transfer SOL to seller
        **ctx.accounts.ai_agent.to_account_info().try_borrow_mut_lamports()? -= sol_to_receive;
        **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += sol_to_receive;

        // Update state
        ai_agent.v_sol -= sol_to_receive;
        ai_agent.v_token += token_amount;
        ai_agent.sol_raised -= sol_to_receive;
        ai_agent.tokens_sold -= token_amount;

        Ok(())
    }

    pub fn claim_vested_contributor_tokens(ctx: Context<ClaimVestedContributorTokens>) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        let current_time = Clock::get()?.unix_timestamp;
        let vesting_end_time = ai_agent.vesting_start_time + ai_agent.vesting_duration;
        let vested_amount = if current_time >= vesting_end_time {
            ai_agent.tokens_for_contributor_pool
        } else {
            let vested_duration = current_time - ai_agent.last_vesting_claim_time;
            (ai_agent.tokens_for_contributor_pool * vested_duration as u64) / ai_agent.vesting_duration as u64
        };

        require!(vested_amount > 0, ErrorCode::NoTokensVested);

        // Mint vested tokens to the contributor pool wallet
        let seeds = &[
            ai_agent.to_account_info().key.as_ref(),
            &[*ctx.bumps.get("ai_agent").unwrap()],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = token::MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.contributor_pool_token_account.to_account_info(),
            authority: ai_agent.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::mint_to(cpi_ctx, vested_amount)?;

        ai_agent.last_vesting_claim_time = current_time;

        Ok(())
    }

    pub fn update_agent_metadata(ctx: Context<UpdateMetadata>, new_metadata: AgentMetadata) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        require!(ctx.accounts.admin.key() == ai_agent.admin, ErrorCode::Unauthorized);
        ai_agent.agent_metadata = new_metadata;
        Ok(())
    }

    pub fn pause(ctx: Context<PauseUnpause>) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        require!(ctx.accounts.admin.key() == ai_agent.admin, ErrorCode::Unauthorized);
        ai_agent.paused = true;
        Ok(())
    }

    pub fn unpause(ctx: Context<PauseUnpause>) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        require!(ctx.accounts.admin.key() == ai_agent.admin, ErrorCode::Unauthorized);
        ai_agent.paused = false;
        Ok(())
    }

    pub fn transfer_admin_to_dao(ctx: Context<TransferAdminToDAO>, new_admin: Pubkey) -> Result<()> {
        let ai_agent = &mut ctx.accounts.ai_agent;
        
        // Ensure only the current admin can transfer ownership
        require!(ctx.accounts.admin.key() == ai_agent.admin, ErrorCode::Unauthorized);

        // Transfer admin rights to the new admin (DAO)
        ai_agent.admin = new_admin;

        // Emit an event for the admin transfer
        emit!(AdminTransferred {
            previous_admin: ctx.accounts.admin.key(),
            new_admin: new_admin,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init,
        payer = admin,
        space = 8 + AIAgent::LEN
    )]
    pub ai_agent: Account<'info, AIAgent>,
    #[account(
        init,
        payer = admin,
        mint::decimals = 9,
        mint::authority = ai_agent,
    )]
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SellTokens<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ClaimVestedContributorTokens<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    #[account(mut)]
    pub contributor_pool_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdateMetadata<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct PauseUnpause<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct TransferAdminToDAO<'info> {
    #[account(mut)]
    pub ai_agent: Account<'info, AIAgent>,
    pub admin: Signer<'info>,
}

#[account]
pub struct AIAgent {
    pub admin: Pubkey,
    pub name: String,
    pub symbol: String,
    pub token_mint: Pubkey,
    pub total_supply: u64,
    pub tokens_on_curve: u64,
    pub tokens_for_liquidity: u64,
    pub tokens_for_contributor_pool: u64,
    pub v_sol: u64,
    pub v_token: u64,
    pub sol_raised: u64,
    pub tokens_sold: u64,
    pub curve_completed: bool,
    pub vesting_start_time: i64,
    pub vesting_duration: i64,
    pub last_vesting_claim_time: i64,
    pub paused: bool,
    pub agent_metadata: AgentMetadata,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct AgentMetadata {
    pub name: String,
    pub description: String,
    pub website: String,
    pub telegram: String,
    pub twitter: String,
    pub github: String,
    pub logo_ipfs_hash: String,
}

impl AIAgent {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // name
        32 + // symbol
        32 + // token_mint
        8 + // total_supply
        8 + // tokens_on_curve
        8 + // tokens_for_liquidity
        8 + // tokens_for_contributor_pool
        8 + // v_sol
        8 + // v_token
        8 + // sol_raised
        8 + // tokens_sold
        1 + // curve_completed
        8 + // vesting_start_time
        8 + // vesting_duration
        8 + // last_vesting_claim_time
        1 + // paused
        32 + 32 + 32 + 32 + 32 + 32 + 32; // agent_metadata (7 * 32 for String)
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid allocation percentages")]
    InvalidAllocation,
    #[msg("Bonding curve is already completed")]
    CurveCompleted,
    #[msg("Insufficient purchase amount")]