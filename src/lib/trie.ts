class TrieNode {
  #nodes: Array<TrieNode>;
  terminal: boolean;
  #character: string;
  constructor(c: string = '') {
    this.#nodes = new Array<TrieNode>;
    this.terminal = false;
    this.#character = c;
  }


  append(n: TrieNode) {
    this.#nodes.push(n)
  }

  get_node(c: string): TrieNode | null {
    if (c.length != 1) {
      console.warn("Bad trie insertion: " + c);
      return null;
    }

    for (const n of this.#nodes) {
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

  get no_children(): boolean {
    return this.#nodes.length == 0;
  }


};

export class Trie {

  #head: TrieNode;
  constructor() {
    this.#head = new TrieNode;
  }

  insert(s: string) {

    let head: TrieNode = this.#head

    for (const c of s) {

      let new_head = head.get_node(c);
      if (new_head === null) {
        new_head = new TrieNode(c);
        head.append(new_head);
      }
      head = new_head;
    }

    head.terminal = true

  }

  /**
   * return `true` iff `this` contains s 
   */
  contains(s: string): boolean {
    const n = this.#containsInternal(s)
    return n !== null && n.terminal;
  }

  /**
   * return `true` iff `this` contains s AND s is not a substring of any other
   * entries in `this`.
   */
  containsExclusive(s: string) {
    const n = this.#containsInternal(s)
    return n !== null && n.terminal && n.no_children;
  }

  #containsInternal(s: string): TrieNode | null {
    let head: TrieNode | null = this.#head

    for (const c of s) {

      head = head.get_node(c)
      if (head === null) {
        return head;
      }

    }

    return head;

  }

  /* TODO: implement */
  // toArray(): string[] {
  //   const a = new Array<string>
  //   return a
  // }
}
