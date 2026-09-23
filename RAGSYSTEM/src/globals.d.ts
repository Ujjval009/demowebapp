declare const claude: {
  use: (name: string) => Promise<{
    text: string
  }>
} | null
