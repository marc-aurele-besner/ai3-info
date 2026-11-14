// Shared by the visible "Field notes" section and the page's FAQPage JSON-LD,
// so the structured data always matches what readers see.

export const farmingDocsUrl = "https://docs.autonomys.xyz";

export const fieldNotes = (count: number) => [
  {
    question: "What am I looking at?",
    answer: `A playful model of the selected network’s totals. The ${count} cells are equal visual portions, not real farmers, locations, or a measure of decentralization. Select a reading, then inspect a cell to connect the model to the numbers.`,
  },
  {
    question: "What is space pledged on Autonomys?",
    answer:
      "Space pledged is the total disk space that farmers have committed to the Autonomys Network. Farmers use it to store pieces of the blockchain’s history, which is how the network is secured.",
  },
  {
    question: "Why pledge storage?",
    answer:
      "Autonomys uses proof of archival storage. Farmers contribute disk space to store pieces of the network’s history and participate in consensus. This sandbox compares capacity; actual farming depends on plotting, hardware, and network conditions.",
  },
  {
    question: "How fresh are these numbers?",
    answer:
      "While this tab is visible, we request a reading every 30 seconds. The API may serve cached readings. If a request fails, the last successful reading stays visible and is labeled. Sample data never updates and is not network activity.",
  },
];
