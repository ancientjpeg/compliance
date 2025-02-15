class TrieNode {
  nodes: Array<TrieNode>;
  #character: string;
  constructor() {
    this.nodes = new Array<TrieNode>;
    this.#character = '';
  }

  append(n: TrieNode) {
    this.nodes.push(n)
  }

  get_node(c: string): TrieNode | null {
    if (c.length != 1) {
      console.warn("Bad trie insertion: " + c);
      return null;
    }

    for (const n of this.nodes) {
      if (n.char == c) {
        return n
      }
    }

    return null;
  }

  get char() {
    return this.#character;
  }

  set char(c: string) {
    if (c.length != 1) {
      console.warn("Bad trie insertion: " + c);
      return;
    }
    this.#character = c;
  }

};

export class Trie {

  #head: TrieNode;
  constructor() {
    this.#head = new TrieNode;
  }

  insert(s: string) {


  }

  contains(s: string): boolean {
    let head = this.#head

    for (const c in s) {

    }




    return true;
  }
}
