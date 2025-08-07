---
layout: notes
title: Someone made a merge before me - GitHub collaboration
date: 2025-05-25
updated: 2025-05-25
description: Collaborative development with git and github.
category: Budding
---
When working with teams, it is always a good idea to have a common understanding of how to collaborate in a single codebase.
Without a common understanding there could be cases where changes are made without others knowing that would create bugs or unintended behaviors.
For example, it could be the case that you are developing a feature for 2 weeks. You made some good work but when you are about to merge, you realise that your develop branch is outdated with the latest develop from origin. Because someone else developed another feature in 1 week. So now that you want to merge, that would mean 2 things:
1. Your code can be merged BUT latest changes in develop may cause unintended consequences in your branch.
	- It could be the case that if you have previews for each branch, your preview may not contain the latest changes from develop and may confuse the quality assurance team.
2. Your code cannot be merged because there are conflicts. That would happen because your branch and the latest merged feature branch, made changes in the same files, so GitHub does not know how to mix both fixes.

This short guide will cover the first case.

### Code can be merged but possible unintended consequences
Imagine that you are working on a login page for your platform. Your task was to implement an automatic scrolling with a button. However, another team mate had implement a parallax effect in the same page. If you don't rebase your branch and merge directly into develop, you may end up realising that your scrolling does not work along the parallax effect that was just introduced.

To avoid such problems, let's explore what would be a way to rebase your changes.
Imagine that these are the current commits in develop.
```sh
> git checkout develop
> git lg
234567 (origin/develop) changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```

Now, let's imagine that you made all your changes in a new feature branch called feature/awesome-feature-1 and once you made your changes your commit history looks like this:
```sh
> git checkout feature/awesome-feature-1
> git lg
123456 changes-feature-1 (6 days ago) <johnchque>
234567 (origin/develop) changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```
That means that in your feature/awesome-feature-1 branch you have 3 commits, where the top one is the latest that you made and the 2 lower ones are in develop already.

However, after you developed your changes and you are about to merge, another developer made some changes and got their branch merged.
```sh
> git checkout develop
> git pull
> git lg
987654 (origin/develop) changes-feature-2 (1 days ago) <jurgen>
234567 changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```
So now develop has 3 commits in your origin.
If you go again to your branch, you will see that you only have 2 commits from develop.
```sh
> git checkout feature/awesome-feature-1
> git lg
123456 changes-feature-1 (6 days ago) <johnchque>
234567 changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```
That means that your local feature branch does not have the latest commit by jurgen.
In order to get jurgen's commit in our feature branch, *we need to rebase our branch*.
For that, we need to ensure first that our local develop branch has the same commits as the develop branch in origin.
```sh
> git checkout develop
> git pull
> git lg
987654 (origin/develop) changes-feature-2 (1 days ago) <jurgen>
234567 changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```
Which looks the same as our commits in GitHub.

Now, we need to ensure our feature branch is rebased.
```sh
> git checkout feature/awesome-feature-1
> git rebase develop
> git lg
123456 changes-feature-1 (6 days ago) <johnchque>
987654 (origin/develop) changes-feature-2 (1 days ago) <jurgen>
234567 changes-develop-2 (5 days ago) <greta>
345678 changes-develop-1 (4 days ago) <greta>
```
Notice now that our feature branch has now 4 commits. 3 are coming from develop, where 2 are from @greta and 1 is from @jurgen. That way, we will ensure that when we run the code from our branch, we can see the latest changes from develop and realise early that our scroll function is not working anymore because of the parallax that jurgen implemented.
## Extra tips:
- It is a good idea to define a source of truth. When teams are collaborating, the origin develop branch should become the source of truth as things should be merged there only when changes are ready.
- If the origin develop branch is the source of truth then it is a good idea to only merge to develop through the UI of your preferred collab platform, in the case of this example, GitHub.
- Add branch protection to develop so not everyone can push there directly.
- When executing commands, it is always good to read the output. A warning or an error may save us endless hours of debugging.
- When creating a pull request, ensure that the target branch (where it will be merged) is develop. We don't want to end with a mess and merge into main (that would still be fixable though but would require time to fix).