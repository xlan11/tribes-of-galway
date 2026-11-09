# Tribes of Galway

Website for Tribes of Galway.

## Design skill

This repo vendors the [taste skill](https://github.com/Leonxlnx/taste-skill) (MIT, upstream commit `f6b7657`, v2.5.1) at `.claude/skills/design-taste-frontend/`, so Claude Code sessions in this repo use it when building or redesigning the site.

It needs Node 22+ and Chrome/Chromium to run its checks. Its Stop hook runs `scripts/gate.mjs`, which only checks a page once a build has been armed with `gate.mjs --start`.

To update it, copy `skills/taste-skill/` from a newer upstream checkout over that folder.
