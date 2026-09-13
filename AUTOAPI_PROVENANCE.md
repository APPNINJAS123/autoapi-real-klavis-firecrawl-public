# AutoAPI public acceptance provenance

This repository is a standalone, history-disconnected public derivative of
[`Klavis-AI/klavis`](https://github.com/Klavis-AI/klavis). Its source snapshot
was taken from the reviewed acceptance commit
`90025d52d31f69fcdd81e6aec80653bea131914a`, whose upstream Klavis source is
identified there as `45c9f7da83d1cf43f7429b96f9c8e8153542ea1e`.

The original reviewed history is intentionally not published because it
contains six historical Slack file-download tokens. Before this disconnected
root was created, those six values were replaced with the literal non-secret
placeholder `AUTOAPI_PUBLIC_FIXTURE_REDACTED` in exactly these three files:

- `mcp_servers/slack_atlas/slack_mcp_eval_export/all-dumle-servers/2025-12-01.json`
- `mcp_servers/slack_atlas/slack_mcp_eval_export/social/2025-12-01.json`
- `mcp_servers/slack_atlas/slack_mcp_eval_export/canvases.json`

No original token value or original Git commit is reachable from this public
history. The disconnected sanitized root is
`4453816f2cee2ba4e8ac49eeaa7da94d6a2455a6`. The upstream `LICENSE` is
preserved byte-for-byte as blob
`261eeb9e9f8b2b4b0d119366dda99c6fd7d35c64`. The three sanitized fixture blobs
are `c7178ffb1125dce807f2bf9fcbeeb381dfd4f605`,
`0ca214bf62245f51df269c9a75b8721194c54ed7`, and
`b8815d579f138c5cf0769e859ce3e6a66235ac36`, in the order listed above.

The files in `scripts/` and `.github/workflows/autoapi-firecrawl.yml` are a
test-only migration contract. AutoAPI may edit only the Firecrawl server source
and its npm manifest/lockfile; the contract, this provenance record, the
license, and the three sanitized fixture files are denied to the migration
worker.

The acceptance overlay is the only commit after the sanitized root. It changes
only this record and `.github/workflows/autoapi-firecrawl.yml`. The workflow
binds baseline certification to the sanitized root, the unchanged Firecrawl
source/manifest/lock/verifier blobs, the preserved license, and the three exact
sanitized fixture blobs. Pull-request validation additionally prevents changes
to every one of those acceptance-boundary files.
