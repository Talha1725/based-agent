use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

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

#[account]
pub struct AIAgent {
    pub admin: Pubkey,
    pub name: String,
    pub symbol: String,
    pub token_mint: Pubkey,
    pub total_supply: u64,
    pub tokens_on_curve: u64,
    pub tokens_for_liquidity: u64,
    pub v_sol: u64,
    pub v_token: u64,
    pub sol_raised: u64,
    pub tokens_sold: u64,
    pub curve_completed: bool,
    pub metadata: AgentMetadata,
}

#[derive(Accounts)]
pub struct InitializeAgent<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, space = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8 + 1 + 200)]
    pub ai_agent: Account<'info, AIAgent>,
    #[account(init, payer = admin, mint::decimals = 9, mint::authority = ai_agent)]
    pub token_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn initialize_agent(ctx: Context<InitializeAgent>, name: String, symbol: String, metadata: AgentMetadata) -> Result<()> {
    let ai_agent = &mut ctx.accounts.ai_agent;
    ai_agent.admin = ctx.accounts.admin.key();
    ai_agent.name = name;
    ai_agent.symbol = symbol;
    ai_agent.token_mint = ctx.accounts.token_mint.key();
    ai_agent.total_supply = 100_000_000 * 10u64.pow(9); // 100 million tokens
    ai_agent.tokens_on_curve = ai_agent.total_supply * 80 / 100; // 80% on curve
    ai_agent.tokens_for_liquidity = ai_agent.total_supply / 5; // 20% for liquidity
    ai_agent.v_sol = 1 * 10u64.pow(9); // Initial virtual SOL reserve
    ai_agent.v_token = 131_449_006_116u64; // Initial virtual token reserve
    ai_agent.metadata = metadata;
    Ok(())
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

pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
    // Implement buy_tokens logic here
    Ok(())
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

pub fn sell_tokens(ctx: Context<SellTokens>, amount: u64) -> Result<()> {
    // Implement sell_tokens logic here
    Ok(())
}