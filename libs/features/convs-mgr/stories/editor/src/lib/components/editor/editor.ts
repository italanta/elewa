import { Injector } from '@angular/core';

import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';

import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { AngularPlugin, Presets as AngularPresets, AngularArea2D } from 'rete-angular-plugin/15';

import { StoryBlock, StoryBlockTypes } from '@app/model/convs-mgr/stories/blocks/main';

import { Coordinate } from '../../model/coordinates.interface';

class Node extends ClassicPreset.Node {
  width = 180;
  height = 120;

  constructor(socket: ClassicPreset.Socket) {
    super("Node");
    this.addInput("port", new ClassicPreset.Input(socket));
    this.addOutput("port", new ClassicPreset.Output(socket));
  }
}

class Connection<N extends Node> extends ClassicPreset.Connection<N, N> {}

type Schemes = GetSchemes<Node, Connection<Node>>;

type AreaExtra = AngularArea2D<Schemes> | MinimapExtra;

export class ReteEditorFrame {

  editor: NodeEditor<Schemes>;
  area: AreaPlugin<Schemes, AreaExtra>;
  socket: ClassicPreset.Socket;
  injector: Injector;

  constructor(container: HTMLElement, injector: Injector) {
    this.socket = new ClassicPreset.Socket('socket');
    this.editor = new NodeEditor<Schemes>();
    this.area = new AreaPlugin<Schemes, AreaExtra>(container);
    this.injector = injector;
  }

  init() {
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new AngularPlugin<Schemes, AreaExtra>({ injector: this.injector });

    AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    const minimap = new MinimapPlugin<Schemes>({
      boundViewport: true,
    });

    render.addPreset(AngularPresets.classic.setup());
    render.addPreset(AngularPresets.minimap.setup({ size: 200 }));

    connection.addPreset(ConnectionPresets.classic.setup());

    this.editor.use(this.area);
    this.area.use(connection);
    this.area.use(render);
    this.area.use(minimap);

    AreaExtensions.simpleNodesOrder(this.area);

    setTimeout(() => {
      AreaExtensions.zoomAt(this.area, this.editor.getNodes());
    }, 300);
  }

  async newBlock(type: StoryBlockTypes, coordinates?: Coordinate) {
    const a = new Node(this.socket);

    const block = {
      type: type,
      message: '',
      position: coordinates || { x: 200, y: 50 },
    } as StoryBlock;

    a.addControl(
      'a',
      new ClassicPreset.InputControl('text', {
        initial: block.message
      })
    );

    await this.editor.addNode(a);  
    await this.area.translate(a.id, block.position);
  }

  async drawConnection(from:Node, to:Node) {
    const connection = new ClassicPreset.Connection(from, 'block-from', to, 'block-to')
    await this.editor.addConnection(connection);
  }

  /** flush/destory the editor and remove all listeners */
  flush() {
    this.area.destroy();
    this.editor.clear();
  }
}
