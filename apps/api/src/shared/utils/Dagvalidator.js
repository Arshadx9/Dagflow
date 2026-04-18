import Apperror from "./Apperror";
const White = 0;
const Gray = 1;
const Black = 2;
export const dfs = (graph, node, visited = {}) => {
    if (!(node in visited))
        visited[node] = White;
    visited[node] = Gray;
    const neighbours = graph[node] || [];
    neighbours.forEach((neighbour) => {
        if (!(neighbour in visited))
            visited[neighbour] = White;
        if (visited[neighbour] === Gray) {
            throw new Apperror(404, "found a cycle");
        }
        if (visited[neighbour] === White) {
            dfs(graph, neighbour, visited);
        }
    });
    visited[node] = Black;
    return visited;
};
