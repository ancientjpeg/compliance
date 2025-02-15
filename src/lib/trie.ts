class TrieNode {
  nodes: Array<TrieNode>;
  terminal: boolean;
  #character: string;
  constructor(c: string = '') {
    this.nodes = new Array<TrieNode>;
    this.terminal = false;
    this.#character = c;
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

  contains(s: string): boolean {
    let head: TrieNode | null = this.#head

    for (const c of s) {

      head = head.get_node(c)
      if (head === null) {
        return false;
      }

    }

    return head.terminal;
  }

  /* TODO: implement */
  // toArray(): string[] {
  //   const a = new Array<string>
  //   return a
  // }
}
