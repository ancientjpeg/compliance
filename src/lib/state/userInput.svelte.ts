export const defaultInput = 'Input your text here.';
export const userInput
  : {
    text: string,
    filename: string | undefined
  }
  = $state({
    text: defaultInput,
    filename: undefined
  })
