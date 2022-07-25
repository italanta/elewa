---
name: Feature request
about: Suggest an idea for this project
title: ''
labels: enhancement
assignees: ''

---

## User stories

A user story is implemented as well as it is communicated.
If the context and the goals are made clear, it will be easier for everyone to implement it, test it, refer to it…

---

Quick links: [Summary](#summary) | [Description](#description) | [Template](#template) | [Example](#example) | [Resources](#resources)

---

### Summary

A user story should typically have a summary structured this way:

1. **As a** [user concerned by the story]
1. **I want** [goal of the story]
1. **so that** [reason for the story]

The “so that” part is optional if more details are provided in the description.

This can then become “As a user managing my properties, I want notifications when adding or removing images.”

You can read about some reasons for this structure in this [nicely put article][1].

### Description

We’re using the following template to create user stories. 

Since we have mentioned the type of user, the user story can refer to it with “I”.
This is useful for **consistency** and to **avoid repetition** in the Acceptance criteria.
It’s also good to practice a little **empathy**.

For example:

```markdown
1. I click on the “submit” button.
1. A modal window appears if I don’t have enough credits.
1. The modal window contains the following:
  1. […]
```

The template uses [markdown][2].
You should get familiar with it if you’re not already, **it’s awesome!**

### Template

```markdown
[
The user story should have a reason to exist: what do I need as the user described in the summary?
This part details any detail that could not be passed by the summary.
]


### Acceptance Criteria

1. [If I do A.]
1. [B should happen.]

[
Also, here are a few points that need to be addressed:

1. Constraint 1;
1. Constraint 2;
1. Constraint 3.
]


### Resources:

* Mockups: [Here goes a URL to or the name of the mockup(s) in inVision];
* Testing URL: [Here goes a URL to the testing branch or IP];
* Staging URL: [Here goes a URL to the feature on staging];


### Notes

[Some complementary notes if necessary:]

* > Here goes a quote from an email
* Here goes whatever useful information can exist…
```

### Example

```markdown
**As a** a member of [the development team](http://scrumguides.org/scrum-guide.html#team-dev),
**I want** clear context and goals **so that** I can work efficiently.

Scattering information in emails and other places makes it difficult to work collaboratively,
so I need all the relevant information within the relevant issue.


### Acceptance Criteria

1. I have clear Acceptance criteria [what a beautiful recursion].
1. I have to understand the logic of the mockups, more than the pixels used, so that we can optimize the code.

Please also note:

1. If a conversation about the issue I’m working on is happening,
the outcomes should be documented within that issue (not in the comments).


### Resources:

* [Style-guides and template for a user story](agile-user-story.md)
* [“Advantages of the “As a user, I want” user story template.”](http://www.mountaingoatsoftware.com/blog/advantages-of-the-as-a-user-i-want-user-story-template)
* [Scrum guide](http://scrumguides.org/scrum-guide.html)
```


### Resources:

* [Style-guides and template for a user story](agile-user-story.md)
* [“Advantages of the “As a user, I want” user story template.”][1]
* [Scrum guide][4]


[1]: http://www.mountaingoatsoftware.com/blog/advantages-of-the-as-a-user-i-want-user-story-template
[2]: http://daringfireball.net/projects/markdown/basics
[3]: http://scrumguides.org/scrum-guide.html#team-dev
[4]: http://scrumguides.org/scrum-guide.html
