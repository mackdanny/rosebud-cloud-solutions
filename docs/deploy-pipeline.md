# Website deploy pipeline: dev and production separation

## Why this exists

Until now `dev` and the live site were the **same Azure Static Web App**
(`swa-uks-web-dev-001`), with both `dev.rosebudcloudsolutions.co.uk` and
`www.rosebudcloudsolutions.co.uk` bound to it. Every push to `main` redeployed
the resource that `www` points at, so any in-progress change could take the live
site down mid-visit. This pipeline separates the two.

## Target state

| Environment | Static Web App | Domain | Deploys when |
|---|---|---|---|
| Dev | `swa-uks-web-dev-001` | `dev.rosebudcloudsolutions.co.uk` | Every push to `main`, `feature/**`, `claude/**` (automatic) |
| Production | `swa-uks-web-prod-001` | `www.rosebudcloudsolutions.co.uk` | Only when you manually promote and approve |

Both apps live in `rg-uks-web-001` (the service principal already has rights
there, so no new Azure role assignment is required).

## How promotion works

1. Push your work as normal. It auto-deploys to **dev** and you review it at
   `dev.rosebudcloudsolutions.co.uk`.
2. When it's good, go to **Actions → Promote to Production → Run workflow**,
   type `promote`, and run it.
3. The run pauses on the `gate` job for **required-reviewer approval** (you are
   the reviewer). Approve it.
4. The `deploy` job builds the current `main` and deploys to the prod app.

Two locks, both in your hands: the manual dispatch and the approval click.
Nothing reaches production by accident.

### Design note (why the deploy job says `environment: dev`)

Azure login uses an OIDC **federated credential** that trusts the `dev`
environment subject. Creating a `production` federated credential needs Entra
app-registration access we don't have. So the deploy job authenticates under the
`dev` identity and the **approval gate lives on a separate `gate` job** bound to
the `production` environment. Which app it deploys to is decided by the service
principal's resource-group RBAC, not by the environment name, so this is safe.

## First run: what to expect

The first promotion is also the test of whether the service principal can
**create** a new app in the resource group:

- **If it succeeds:** `swa-uks-web-prod-001` is created and the site deploys.
  You're fully self-sufficient. Grab the printed `*.azurestaticapps.net`
  hostname and verify prod there.
- **If it fails at "Ensure prod Static Web App exists":** the SP has rights on
  the existing dev app only, not group-wide create. That's the one thing to ask
  Alex for (see below). Everything else is already done.

Optional: to get a real HTTPS test URL for prod before touching `www`, add a
Cloudflare CNAME `prod` -> the printed hostname, then re-run. That binds
`prod.rosebudcloudsolutions.co.uk`. `www` is never touched by this workflow.

## Phase 2: the www cutover (deliberate, done once)

When you're happy prod is serving correctly, move the live domain:

1. In Cloudflare, repoint `www` (CNAME) from the dev app hostname to the prod
   app hostname (`swa-uks-web-prod-001`'s `*.azurestaticapps.net`).
2. Bind `www` on the prod app:
   `az staticwebapp hostname set -n swa-uks-web-prod-001 -g rg-uks-web-001 --hostname www.rosebudcloudsolutions.co.uk`
3. Unbind `www` from the dev app:
   `az staticwebapp hostname delete -n swa-uks-web-dev-001 -g rg-uks-web-001 --hostname www.rosebudcloudsolutions.co.uk`
4. In `deploy-dev.yml`, remove `www.rosebudcloudsolutions.co.uk` from the
   hostname-bind loop and remove the Cloudflare-purge step (move cache purge into
   `deploy-prod.yml` so only production deploys purge the live cache).

Until Phase 2 is run, `www` keeps being served by the dev app exactly as today,
so there is zero risk in setting all of this up ahead of time.

## The only possible ask for Alex (conditional)

Needed **only** if the first promotion fails at the create step. Two-minute job
for whoever has subscription/Owner access:

> Please grant the website deploy service principal **Contributor on resource
> group `rg-uks-web-001`** (it currently appears scoped to the dev app only), OR
> create an empty Static Web App `swa-uks-web-prod-001` in `rg-uks-web-001`
> (Free SKU, West Europe) and grant that SP Contributor on it.

No Entra / app-registration change is required either way.
