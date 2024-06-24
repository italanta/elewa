import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';

import {  Logger } from '@iote/bricks-angular';
import { Story } from '@app/model/convs-mgr/stories/main';

import { BotVersions } from '@app/model/convs-mgr/bots';
import { ActiveStoryStore } from '@app/state/convs-mgr/stories';
import { StoryModuleTypes } from '@app/model/convs-mgr/stories/blocks/structural';

@Component({
  selector: 'lib-bot-builder-page',
  templateUrl: './bot-builder.page.html',
  styleUrls: ['./bot-builder.page.scss']
})
export class BotBuilderPageComponent implements OnInit, OnDestroy 
{
  private _sbS = new SubSink();
  private _activeRoute: string;

  constructor(private _story$$: ActiveStoryStore,
              private _router$$: Router,
              private _route: ActivatedRoute,
              private _logger: Logger) 
  { }

  ngOnInit(): void 
  {
    this._sbS.sink = 
      this._story$$.get()
          .subscribe(s => 
      {
        // If new story route, render correct editor by navigating to it (code-splitted editors)
        if(s.id !== this._activeRoute)
        {
          this._activeRoute = s.id as string;

          const editorRoute = this._determineRoute(s);
          this._router$$.navigate(['stories', s.id, editorRoute]);
        }
      });
  }

  /** Determines which story editor to load for the active story */
  private _determineRoute(s: Story)
  {
    // If versioning was not yet active, it's def. the old editor
    if(!s.version || s.version === BotVersions.V1Modular)
      return 'story-editor';

    // If the story is newer, switch on type
    switch(s.type)
    {
      // Case 1. Story is the bot root or a sub of type story
      case StoryModuleTypes.Story:
      case StoryModuleTypes.SubStory:
        return 'story-editor';
      
      // Case 2. Story is a flow
      case StoryModuleTypes.Flow:
        return 'flow-editor';
      
      // Case 3. Story is an assessment
      case StoryModuleTypes.Assessment:
        return 'assessment-editor';

      // Case 4. Story is a micro-app
      case StoryModuleTypes.MicroApp:
        return 'micro-app';
    }

    throw new Error(`Could not determine story type of ${s.id} - ${s.name}. Crashing editor`);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}

