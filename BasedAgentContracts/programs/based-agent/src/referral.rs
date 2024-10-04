use anchor_lang::prelude::*;

#[account]
pub struct ReferralSystem {
    pub referrers: Vec<Pubkey>,
    pub referrals: Vec<(Pubkey, Pubkey)>, // (referee, referrer)
}

#[derive(Accounts)]
pub struct CreateReferralLink<'info> {
    #[account(mut)]
    pub referral_system: Account<'info, ReferralSystem>,
    #[account(mut)]
    pub admin: Signer<'info>,
}

pub fn create_referral_link(ctx: Context<CreateReferralLink>, referrer: Pubkey) -> Result<()> {
    let referral_system = &mut ctx.accounts.referral_system;
    if !referral_system.referrers.contains(&referrer) {
        referral_system.referrers.push(referrer);
    }
    Ok(())
}

#[derive(Accounts)]
pub struct UseReferralLink<'info> {
    #[account(mut)]
    pub referral_system: Account<'info, ReferralSystem>,
    #[account(mut)]
    pub user: Signer<'info>,
}

pub fn use_referral_link(ctx: Context<UseReferralLink>, referee: Pubkey, referrer: Pubkey) -> Result<()> {
    let referral_system = &mut ctx.accounts.referral_system;
    if referral_system.referrers.contains(&referrer) {
        referral_system.referrals.push((referee, referrer));
    }
    Ok(())
}