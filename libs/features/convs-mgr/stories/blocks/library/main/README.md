# @app/features/convs-mgr/stories/blocks/library

This library holds all the different blocks which can be rendered in the Story Editor.

For each StoryBlock, this library holds an implementation:

- **MessageBlockComponent**: Sends a text message.
- TODO - Other blocks

Internally, the **StoryBlockComponent** utilises a polymorph component design to render all the StoryBlock implementations.

The library exports the following:

- **BlockInjectorService**: This service is a key part at the heart of the StoryBlock-editor, as it renders blocks within the editor. It exports one function *newBlock* which renders completely new, or pre-existing/pre-configured blocks.