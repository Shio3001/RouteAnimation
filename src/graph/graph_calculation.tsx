import EditData from "../component/ctrl_dataflow/edit_data/edit_data";
import LayerData from "../component/ctrl_dataflow/edit_data/layer_data";
import { TypeGISInfo, TypeJsonCoordinates } from "../gis_scipt/route_type";
import { searchGisConditional, getGeometry } from "../gis_scipt/gis_unique_data";

import SvgKit from "../parser/sgml_kit/svg_kit/svg_kit";
import SvgNode from "../parser/sgml_kit/svg_kit/svg_node";

import GraphNode from "./graph_node";
import Graph from "./graph";
import GraphCoordinateExpression from "./expression/coordinate_expression";
import GraphCalculationNodePath from "./graph_calculation_node_path";

class GraphCalculation {
  graph_container: Graph;
  processed_path: Map<number, GraphCoordinateExpression>;

  bfs_que: Array<string>;
  node_path: GraphCalculationNodePath;

  constructor(graph: Graph) {
    this.graph_container = graph;
    this.node_path = new GraphCalculationNodePath();

    this.processed_path = new Map();
    this.bfs_que = [];
  }

  getProcessedPath = () => {
    return this.processed_path;
  };

  debugNode = () => {
    const node_keys = this.graph_container.graph.keys();
    console.log("debugNode ", this.graph_container.graph, this.graph_container.graph.size);
    for (const key of node_keys) {
      const node = this.graph_container.graph.get(key);

      console.log("debugNodeK ", key);

      for (let j = 0; j < node.bidirectional_link_id_list.length; j++) {
        const link_node_id = node.bidirectional_link_id_list[j];
        const link_node = this.graph_container.graph.get(link_node_id);

        const index = this.pushProcessed();
        // this.pushCoordinate(index, node.x, node.y);
        // this.pushCoordinate(index, link_node.x, link_node.y);
      }
    }
  };

  startCalc = () => {
    const node_keys = this.graph_container.graph.keys();

    const termination_point = this.getTerminationPointID();
    // const termination_even_point = this.getTerminationEvenPointID();

    console.log("termination_point", termination_point);

    this.graph_container.graph.forEach(function (node, key) {
      console.log("termination_point -alllinks", key, node.bidirectional_link_id_list);
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length == 1) {
        console.log("termination_point -graph1", key, node.bidirectional_link_id_list);
      }
    });
    this.graph_container.graph.forEach(function (node, key) {
      if (node.bidirectional_link_id_list.length >= 3) {
        console.log("termination_point -graph3", key, node.bidirectional_link_id_list);
      }
    });

    // for (const key of node_keys) {
    //   this.node_path.pushNode(key, -1);
    // }

    console.log("termination_point", termination_point);
    for (let i = 0; i < termination_point.length; i++) {
      const termination_point_node_id = termination_point[i];
      const termination_point_node = this.graph_container.graph.get(termination_point_node_id);
      if (this.isValidNodePath(termination_point_node_id)) {
        continue;
      }
      const p_index = this.pushProcessedPos(termination_point_node_id, termination_point_node.x, termination_point_node.y);
      this.node_path.pushNode(termination_point_node_id, p_index);
      this.dfs(termination_point_node_id);
    }

    console.log("処理済みパス", this.processed_path.size, this.processed_path);
  };

  pushProcessed = () => {
    const g = new GraphCoordinateExpression("path");
    const path_id = this.processed_path.size;
    g.setCoordinateExpressionId(path_id);

    this.processed_path.set(path_id, g);
    return path_id;
  };
  pushProcessedPos = (node_id: string, x: number, y: number) => {
    const path_index = this.pushProcessed();
    const g = this.processed_path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.processed_path.set(path_index, g);
    return path_index;
  };

  pushCoordinateId = (path_index: number, node_id: string, x: number, y: number) => {
    const g = this.processed_path.get(path_index);
    g.pushCoordinateId(node_id, x, y);
    this.processed_path.set(path_index, g);
  };
  hasCoordinateId = (path_index: number, node_id: string) => {
    return this.processed_path.get(path_index).hasPosId(node_id);
  };
  popDfsStack = () => {
    const v = this.bfs_que[this.bfs_que.length - 1];
    this.bfs_que.pop();
    return v;
  };

  isValidNodePath = (node_id: string) => {
    return this.node_path.isValidNode(node_id);
  };

  dfs = (start_node_id: string) => {
    console.log("幅優先探索", start_node_id, this.node_path, this.graph_container.graph);
    this.bfs_que = [];
    this.bfs_que.push(start_node_id);

    const start_node = this.graph_container.graph.get(start_node_id);
    const start_node_paths = this.node_path.getPaths(start_node_id);

    for (let start_node_path of start_node_paths) {
      this.pushCoordinateId(start_node_path, start_node_id, start_node.x, start_node.y);
    }

    console.log("termination_point -search start", start_node_id);

    while (this.bfs_que.length > 0) {
      const que_length = this.bfs_que.length;

      const current_node_id = this.popDfsStack();
      const current_node = this.graph_container.graph.get(current_node_id);
      const link_id_list = current_node.bidirectional_link_id_list;
      const link_id_list_length = link_id_list.length;
      const current_node_paths = this.node_path.getPaths(current_node_id);

      console.log("termination_point -search", link_id_list_length, current_node_id, link_id_list);

      for (let j = 0; j < link_id_list_length; j++) {
        const nv_id = link_id_list[j];
        const nv_node = this.graph_container.graph.get(nv_id);

        if (this.node_path.otheGroupPath(current_node_id, nv_id)) {
          continue;
        }

        if (link_id_list_length >= 3) {
          const path_index = this.pushProcessedPos(current_node_id, current_node.x, current_node.y);
          this.pushCoordinateId(path_index, nv_id, nv_node.x, nv_node.y);
          this.node_path.pushNode(current_node_id, path_index);
          this.node_path.pushNode(nv_id, path_index);
        } else {
          for (let current_node_path of current_node_paths) {
            this.pushCoordinateId(current_node_path, nv_id, nv_node.x, nv_node.y);
            this.node_path.pushNode(nv_id, current_node_path);
          }
        }
        this.bfs_que.push(nv_id);
      }
    }
  };

  getTerminationPointID = (): Array<string> => {
    const t_id: Array<string> = [];
    let loop_candidacy = ""; //ループ状になってた時は循環してしまう。そのため起点が存在しない。その場合用の候補

    const itr_node_keys = this.graph_container.graph.keys();
    const node_keys = Array.from(itr_node_keys);

    for (let i = 0; i < node_keys.length; i++) {
      const node_key = node_keys[i];
      const node = this.graph_container.graph.get(node_key);
      if (node.bidirectional_link_id_list.length == 1) {
        t_id.push(node_key);
        continue;
      }
    }

    return t_id;
  };
}

export default GraphCalculation;
