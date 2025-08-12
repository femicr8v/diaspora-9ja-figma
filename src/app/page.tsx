import LandingPage from "@/components/LandingPage";
import Image from "next/image";

export default function Home() {
  return (
    <section className="border-4 border-amber-400 flex flex-col justify-center items-center h-screen bg-secondary-foreground">
      {/* <LandingPage
        onGetStarted={() => {}}
        onNavigate={() => {}}
        onSignIn={() => {}}
      /> */}
    </section>
  );
}

/*
<section className="border-4 border-amber-400 flex flex-col justify-center items-center h-screen bg-secondary-foreground">
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h4>Header 4</h4>
      <h5>Header 5</h5>
      <h6>Header 6</h6>

      <br />

      <p className="font-space-">Paragraph</p>
      <span>Span</span>
      <a>Link</a>

      <br />

      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>

      <br />

      <th>Table Header</th>
      <td>Table Data</td>

      <br />

      <label>Item</label>
      <input type="text" placeholder="Input..." />
      <button>Button</button>
    </section>
*/
