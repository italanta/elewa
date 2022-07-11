# The Story Model

A story has the following data model:

**Story Data Model** 
---
| Column  | Type   | Description    |
|---------|--------|----------------|
| ID      | GUID   | Story ID - PK  |
| OrgID   | GUID   | FK to Organisation |
| Name    | STRING | Story name |

When a story is created, two Blocks will implicetely be created as well, namely the **Start block** (*ID = StoryId*), which captures the first message and the **End block** (*ID = StoryId_end*) which captures the final block and closes the story/conversation*. These blocks provide us with the anchors to create the story.

`* When a story ends, it goes back to the main loop 

**Section Data Model** 
---
| Column  | Type   | Description    |
|---------|--------|----------------|
| ID      | GUID   | Story ID - PK  |
| OrgID   | GUID   | FK to Organisation |
| Name    | STRING | Section name |
| storyID?   | GUID   | Optional FK to Story |

A section acts just like a story, only that it can be re-used. Whereas a story is loaded into a "channel" (communication channel i.e. whatsapp, messenger, Telegram, ...), a section is loaded by a specific "section-block".


<!--
The story data model is thus rather simple. However, just as any story book, the story is made out up of different blocks which each capture a sections and sub-sections. It's the interplay of these two which allow us to author (very) large and extensive chat conversations.
-->
