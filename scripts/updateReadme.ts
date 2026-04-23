import fs from "node:fs";

type QuoteResponse = {
  type:string;
  setup:string;
  punchline:string;
  id:number;
};

const README_PATH = "README.md";
const JOKE_MARKER = /<!--JOKE-->[\s\S]*?<!--\/JOKE-->/;
const PUNCHLINE_MARKER = /<!--PUNCH-->[\s\S]*?<!--\/PUNCH-->/;

async function main() {
    
  const data = await GetProgrammingJoke();

  const joke = data.setup;
  const punch = data.punchline;

  const readme = fs.readFileSync(README_PATH, "utf8");
const updated = readme
  .replace(
    JOKE_MARKER,
    `<!--JOKE-->${joke}<!--/JOKE-->`
  )
  .replace(
    PUNCHLINE_MARKER,
    `<!--PUNCH-->${punch}<!--/PUNCH-->`
  );
  

  fs.writeFileSync(README_PATH, updated, "utf8");
  console.log(`Updated README with new joke. Id: ${data.id.toString()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


const GetProgrammingJoke = async () => {
    while(true){
        const response = await fetch("https://official-joke-api.appspot.com/jokes/random")
        if(!response.ok) throw new Error(`API request failed: ${response.status} ${response.statusText}`);

        const data = await response.json() as QuoteResponse;

        if(data.type==="programming") return data;

        console.log("Skipped non-programming joke:", data.type)
    }
}