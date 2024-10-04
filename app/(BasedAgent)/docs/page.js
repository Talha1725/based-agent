import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DocSection = ({ title, content }) => (
  <Card className="bg-white  mb-8 border-2 border-blackCustom rounded-none">
    <CardHeader>
      <CardTitle className="text-2xl font-bold text-gray-800 ">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="text-gray-700 ">{content}</CardContent>
  </Card>
);

const AccordionSection = ({ items }) => (
  <Accordion type="single" collapsible className="mb-8">
    {items.map((item, index) => (
      <AccordionItem
        key={index}
        value={`item-${index}`}
        className=" border-2 border-blackCustom rounded-none"
      >
        <AccordionTrigger className="text-xl font-semibold text-gray-800  hover:bg-gray-100 px-4 py-2 rounded-t-md">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="bg-white  text-gray-700  px-4 py-2 rounded-b-md">
          <ul className="list-disc pl-6 space-y-2">
            {item.content.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

const Docs = () => {
  const whatIsBasedAgent = (
    <>
      <p>
        BasedAgent is a revolutionary platform that combines AI agents with
        tokenomics and decentralized governance. It allows developers to create,
        launch, and manage AI agents with their own custom tokens and DAOs,
        fostering a collaborative ecosystem for AI development and token-based
        incentives.
      </p>
      <p className="mt-4">
        BasedAgent supports AI Agents at all stages of development, from initial
        concept and ideation to fully-fledged Agents in production generating
        significant revenue. This inclusive approach allows for a diverse
        ecosystem of AI projects and encourages innovation at every level.
      </p>
    </>
  );

  const accordionItems = [
    {
      title: "Tokenomics",
      content: [
        "Each token has a fixed supply of 100 million.",
        "50% of the token supply is allocated to the Capital Pool for token purchasers.",
        "The other 50% forms the Contributor Pool, rewarding code contributions and other work for the Agent.",
        "Contributor Pool tokens are subject to a 1000-day streaming period.",
        "BasedAgent uses bonding curves, bonded to ETH and SOL.",
        "When an individual Agent's market cap reaches $69,000, a liquidity pool is created on Base for that Agent's token.",
        "BasedAgent generates revenue through fees on Agent creation and token trades.",
        "AI Agents can be deployed on both Base (an Ethereum Layer 2) and Solana networks, benefiting both ecosystems.",
      ],
    },
    {
      title: "Governance and Administration",
      content: [
        "Each Agent has an admin, initially the creator of the linked GitHub repo.",
        "Admins can add other admins at their discretion.",
        "When an AI Agent is launched on BasedAgent, it comes with a custom token and DAO.",
        "The DAO enables token-weighted governance for decision-making.",
        "The DAO provides a wallet address for the Agent to receive funds or pay expenses.",
        "If admins fail to merge pull requests, they risk losing contributors to more active projects.",
      ],
    },
    {
      title: "Contribution and Rewards",
      content: [
        "Contributors can submit pull requests to the Agent's GitHub repo.",
        "Merged pull requests count as successful contributions, eligible for Weights in the Agent.",
        "A special formula determines the amount of Weights awarded for each contribution.",
        "The formula continuously adjusts and learns, optimizing for contributions that improve Agent performance.",
        "Contributors can claim tokens monthly, proportional to their weight in each Agent they've contributed to.",
        "Contributors are ranked according to their contributions, with higher ranks attracting more collaboration opportunities and community recognition.",
      ],
    },
  ];

  const benefits = [
    "Incentivizes continuous improvement and collaboration in AI development.",
    "Provides a fair and transparent system for rewarding contributions.",
    "Enables decentralized governance for AI agents.",
    "Creates a liquid market for AI agent tokens.",
    "Fosters an ecosystem of AI innovation and development.",
    "Supports multi-chain deployment, benefiting both Solana and Ethereum ecosystems.",
    "Encourages healthy competition and collaboration between AI Agents.",
    "Supports AI Agents at all stages, from concept to production, encouraging innovation at every level.",
    "Provides a ranking system for contributors, incentivizing high-quality contributions and fostering community recognition.",
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 ">
          BasedAgent Documentation
        </h1>

        <DocSection title="What is BasedAgent?" content={whatIsBasedAgent} />
        <AccordionSection items={accordionItems} />
        <DocSection
          title="Benefits of BasedAgent"
          content={
            <ul className="list-disc pl-6 space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          }
        />
      </div>
    </div>
  );
};

export default Docs;
