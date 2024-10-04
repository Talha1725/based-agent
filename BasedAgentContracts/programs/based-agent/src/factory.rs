use anchor_lang::prelude::*;
use crate::token::{AIAgent, AgentMetadata};

#[derive(Accounts)]
pub struct CreateAgent<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, space = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 8 + 1 + 200)]
    pub ai_agent: Account<'info, AIAgent>,
    pub system_program: Program<'info, System>,
}

pub fn create_agent(ctx: Context<CreateAgent>, name: String, symbol: String, metadata: AgentMetadata) -> Result<()> {
    let ai_agent = &mut ctx.accounts.ai_agent;
    ai_agent.admin = ctx.accounts.admin.key();
    ai_agent.name = name;
    ai_agent.symbol = symbol;
    ai_agent.metadata = metadata;
    // Initialize other fields as needed
    Ok(())
}