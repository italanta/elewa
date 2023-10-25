import { Injector } from '@angular/core';

import { NodeEditor, GetSchemes, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin';
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from 'rete-connection-plugin';

import { AngularPlugin, Presets, AngularArea2D } from 'rete-angular-plugin/15';
import { StoryBlock } from '@app/model/convs-mgr/stories/blocks/main';

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

export class ReteEditor {

  editor: NodeEditor<Schemes>;
  area: AreaPlugin<Schemes, AreaExtra>;
  socket: ClassicPreset.Socket;

  constructor(container: HTMLElement, injector: Injector) {
    this.socket = new ClassicPreset.Socket('socket');
    this.editor = new NodeEditor<Schemes>();
    this.area = new AreaPlugin<Schemes, AreaExtra>(container);
    this.init(injector);
  }

  init(injector: Injector) {
    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    const render = new AngularPlugin<Schemes, AreaExtra>({ injector });

    AreaExtensions.selectableNodes(this.area, AreaExtensions.selector(), {
      accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    const minimap = new MinimapPlugin<Schemes>({
      boundViewport: true,
    });

    render.addPreset(Presets.classic.setup());
    render.addPreset(Presets.minimap.setup({ size: 200 }));

    connection.addPreset(ConnectionPresets.classic.setup());

    this.editor.use(this.area);
    this.area.use(connection);
    this.area.use(render);
    this.area.use(minimap);

    AreaExtensions.simpleNodesOrder(this.area);
    AreaExtensions.zoomAt(this.area, this.editor.getNodes());
  }

  async addNode(block: StoryBlock) {
    const a = new Node(this.socket);

    a.addControl(
      'a',
      new ClassicPreset.InputControl('text', {
        initial: block.message
      })
    );

    await this.editor.addNode(a);  
    await this.area.translate(a.id, { x: 320, y: 0 });
  }

  async drawConnection(a:Node, b:Node) {
    const connection = new ClassicPreset.Connection(a, 'a', b, 'b')
    await this.editor.addConnection(connection);
  }
}
