class DependencyGraphNode {
    constructor(desc) {
        /** @member {Array<string>} */
        this.Name = desc.Name;

        /** @member {Array<DependencyGraphNode>} */
        this.DependencyNodes = [];

        this.SetDependencies(desc.DependencyNodes || []);

        /** @member {Array<DependencyGraphNode>} */
        this.DependantNodes = [];

        this.Value = undefined;

        this.Dirty = false;
    }

    MarkDirty() {
        for(let dependant of this.DependantNodes) dependant.MarkDirty();
        this.Dirty = true;
    }

    SetDependencies(dependencyNodes) {
        const depsToRemove = this.DependencyNodes.filter(x => !dependencyNodes.includes(x));
        for(let oldDependencyNode of depsToRemove) {
            const index = oldDependencyNode.DependantNodes.indexOf(this);
            console.assert(index !== -1);
            oldDependencyNode.DependantNodes.splice(index);
        }

        const depsToAdd = dependencyNodes.filter(x => !this.DependencyNodes.includes(x));
        for(let newDependencyNode of depsToAdd) {
            newDependencyNode.DependantNodes.push(this);
            this.DependencyNodes.push(newDependencyNode);
        }
    }
}

class DependencyGraph {
    constructor() {
        /** @member {Map<string, DependencyGraphNode>} */
        this.nodesByName = new Map();
    }

    NodeByName(name) {
        return this.nodesByName.get(name);
    }

    MarkDifferenceDirty(otherGraph) {

    }
}
