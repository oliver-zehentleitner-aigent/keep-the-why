# keep-the-why-lint

Structural CI linter for [Keep the Why](https://keepthewhy.com) projects. It validates the machine-checkable half of the schema — required entry fields, valid values, index consistency, `.keep-the-why` integrity, hidden-content red flags — and deliberately stops there: whether the recorded rationale is *true, complete, or honest* is not mechanically checkable, and this tool doesn't pretend otherwise.

Schema-version-aware: it reads the target project's `context-schema` and only enforces what that skill version defines, so an unmigrated project never fails on structure its version didn't have. Python 3.10+, no dependencies beyond the standard library.

```bash
pip install keep-the-why-lint
ktw-lint /path/to/project            # exit 0 clean, 1 findings
ktw-lint /path/to/project --strict   # warnings fail too
```

GitHub Actions (always the latest linter; no consumer-side pinning needed):

```yaml
- uses: oliver-zehentleitner/keep-the-why@latest
```

Full documentation — GitLab CI and pre-commit snippets, the version scheme, every finding code: **https://keepthewhy.com/linting/**

Part of the [keep-the-why](https://github.com/oliver-zehentleitner/keep-the-why) repository (`lint/`), versioned as `<schema>.<revision>`: the first three segments are the newest skill schema this release knows every structural gate of, the fourth is the linter's own revision. MIT.
