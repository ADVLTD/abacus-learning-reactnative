Thank you for considering contributing!

We welcome all external contributions. This document outlines the process of contributing.
For contributing to other repositories, see `CONTRIBUTING.md` in the corresponding repository.


# Pull Requests and Issues

All the contributions to this repo happen via Pull Requests. To create a Pull Request, fork the repo, create a new branch, do the work there, and then send the PR via Github interface.

The PRs should always be against the `master` branch.

The exact process depends on the particular contribution you are making.

## Typos or small fixes

If you see an obvious typo, or an obvious bug that can be fixed with a small change, in the code or documentation, feel free to submit the pull request that fixes it without opening an issue.

## Working on current tasks

If you have never contributed before, take a look at the work items in the issue tracker labeled with `good first issue` [here](https://github.com/alsaabLTD/abacus-learning-reactnative/issues). If you see one that looks interesting, and is not claimed, please comment on the issue that you would like to start working on it, and someone from the team will assign it to you.

Keep in mind the following:

1. The changes need to be thoroughly tested. 
2. Because of (1), starting with a `good first test` task is a good idea.
3. If you get an issue assigned to you, please post updates at least once a week. It is also preferred for you to send a draft PR as early as you have something working, before it is ready.

### Submitting the PR

Once your change is ready, prepare the PR. The PR can contain any number of commits, but when it is merged, they will all get squashed. The commit names and descriptions can be arbitrary, but the name and the description of the PR must follow the following template:

```
<type>: <name>

<description>

Test plan
---------
<test plan>
```

Where `type` is `fix` for fixes, `feat` for features, `refactor` for changes that primarily reorganize code, `doc` for changes that primarily change documentation or comments, and `test` for changes that primarily introduce new tests. The type is case sensitive.

The `test plan` should describe in detail what tests are presented, and what cases they cover.

### After the PR is submitted

1. We will have a CI process configured (TBC) to run all the sanity tests on each PR. If the CI fails on your PR, you need to fix it before it will be reviewed.
2. Once the CI passes, you should expect the first feedback to appear within 72 hours.
   The reviewers will first review your tests, and make sure that they can convince themselves the test coverage is adequate before they even look into the change, so make sure you tested all the corner cases.
   If you would like to request review from a specific review, feel free to do so [through the github UI](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review).
3. Once you address all the comments, and your PR is accepted, we will take care of merging it.
4. If your PR introduces a new feature, please document it in [CHANGELOG.md](CHANGELOG.md) under `unreleased`.

## Proposing new ideas and features

If you want to propose an idea or a feature and work on it, create a new issue in the repository. We presently do not have an issue template.

You should expect someone to comment on the issue within 72 hours after it is created. If the proposal in the issue is accepted, you should then follow the process for `Working on current tasks` above.

## Issue Labels

Issue labels are of the following format `<type>-<content>` where `<type>` is a capital letter indicating the type of the label and `<content>` is a hyphened phrase indicating what is label is about.
For example, in the label `C-bug`, `C` means category and `bug` means that the label is about bugs.
Common types include `C`, which means category, `A`, which means area, `T`, which means team.

An issue can have multiple labels including which area it touches, which team should be responsible for the issue, and so on.
Each issue should have at least one label attached to it after it is triaged and the label could be a general one, such as `C-enhancement` or `C-bug`.
