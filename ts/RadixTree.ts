import {RadixTreeNode} from "./RadixTreeNode";
export class RadixTree<T> {
    private root: RadixTreeNode<T> = new RadixTreeNode("", null);

    constructor () {

    }

    insert(word: string, value: T) {
        let currentNode: RadixTreeNode<T> = this.root;
        let cumulatedWord: string = "";
        while (true) {
            const sufix: string = word.substr(cumulatedWord.length);
            const nextNode: RadixTreeNode<T> = currentNode.selectNextNodeFromPrefix(sufix);
            if (nextNode === null) {
                if (currentNode.isLeaf()) {
                    currentNode.addChild(new RadixTreeNode("", currentNode.value));
                    currentNode.addChild(new RadixTreeNode(sufix, value));
                    currentNode.value = null;
                } else {
                    let nodeToBeSplitted = currentNode.getNodeWithSharedPrefix(sufix);
                    if (nodeToBeSplitted === null) {
                        currentNode.addChild(new RadixTreeNode(sufix, value));
                    } else {
                        const commonPrefix: string = nodeToBeSplitted.getCommonPrefix(sufix);
                        nodeToBeSplitted.addChild(new RadixTreeNode(nodeToBeSplitted.word.substr(commonPrefix.length), nodeToBeSplitted.value));
                        nodeToBeSplitted.addChild(new RadixTreeNode(sufix.substr(commonPrefix.length), value));
                        nodeToBeSplitted.word = commonPrefix;
                        nodeToBeSplitted.value = null;
                    }
                }
                break;
            } else {
                currentNode = nextNode;
                cumulatedWord += nextNode.word;
            }
        }

    }

    contains(word: string) {
        let currentNode: RadixTreeNode<T> = this.root;
        let cumulatedWord: string = "";

        while (currentNode !== null && !currentNode.isLeaf() && cumulatedWord.length <= word.length) {
            const sufix: string = word.substr(cumulatedWord.length);
            const nextNode: RadixTreeNode<T> = currentNode.selectNextNodeFromPrefix(sufix);

            if (nextNode !== null) {
                currentNode = nextNode;
                cumulatedWord += nextNode.word;
            } else {
                currentNode = null;
            }
        }
        return (currentNode !== null && currentNode.isLeaf() && cumulatedWord.length === word.length);
    }
}