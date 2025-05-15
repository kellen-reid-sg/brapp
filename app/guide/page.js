import React from 'react';

export default function PromptingGuide() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl bg-white">
      {/* Header */}
      <header className="bg-black text-white p-8 mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Effective Prompt Engineering for Developers</h1>
        <p className="text-xl">Nine key principles for getting exceptional results from AI assistants</p>
      </header>

      {/* Nine Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Principle 1 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">1</div>
          <h3 className="text-xl font-bold mb-2">The First Prompt Is Decisive</h3>
          <p>Your opening message sets the rails for the entire conversation. A well-framed first prompt is "night and day" better than a sparse "fix this" request.</p>
        </div>

        {/* Principle 2 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">2</div>
          <h3 className="text-xl font-bold mb-2">Think: Senior Dev With Amnesia</h3>
          <p>Explain what problem you're facing, what matters, what you've tried, where the code lives, how to reproduce the issue, and what not to touch.</p>
        </div>

        {/* Principle 3 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">3</div>
          <h3 className="text-xl font-bold mb-2">Use a Good Bug Report Format</h3>
          <p>Name files, functions, include screenshots, error output and desired outcomes. Avoid vague pleas like "make this go away."</p>
        </div>

        {/* Principle 4 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">4</div>
          <h3 className="text-xl font-bold mb-2">Be Surgically Specific</h3>
          <p>Point directly to the relevant component or file and state the expected change; otherwise the model must guess, producing confused attempts.</p>
        </div>

        {/* Principle 5 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">5</div>
          <h3 className="text-xl font-bold mb-2">Provide Verification Steps</h3>
          <p>Guide the model to verify its own work. Tell it to run tests, build the project, or reload the page so it can catch errors instead of "flying blind."</p>
        </div>

        {/* Principle 6 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">6</div>
          <h3 className="text-xl font-bold mb-2">Use Imperative Language for Tools</h3>
          <p>If you need a particular tool (search, build, database), say so explicitly rather than making polite suggestions.</p>
        </div>

        {/* Principle 7 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">7</div>
          <h3 className="text-xl font-bold mb-2">Include Visual References</h3>
          <p>For UI tasks, attach screenshots or mockups. The model parses images well, and describing UI glitches in prose alone is fragile.</p>
        </div>

        {/* Principle 8 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">8</div>
          <h3 className="text-xl font-bold mb-2">Keep Conversations Focused</h3>
          <p>Long threads make the model "feel drunk." Start fresh when the goal changes and keep each conversation laser-focused on one task.</p>
        </div>

        {/* Principle 9 */}
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
          <div className="text-6xl font-bold mb-4">9</div>
          <h3 className="text-xl font-bold mb-2">Add Inspiration for Creative Work</h3>
          <p>Example screenshots, mood boards, or style frames help design far better than abstract adjectives like "clean" or "modern."</p>
        </div>
      </div>

      {/* What is Prompting */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Prompting</h2>
        <p className="text-lg mb-3">Prompting is the art of crafting effective instructions or queries to guide an LLM's response, it's what you're inputting into the LLM.</p>
        <p className="text-lg mb-6">Good prompting can significantly improve the quality, relevance, and accuracy of the LLM's output.</p>
        
        {/* Diagram */}
        <div className="my-6 border-2 border-dashed p-6 flex flex-col items-center">
          <p className="text-lg font-semibold mb-4">Refinement</p>
          <div className="flex items-center justify-between w-full">
            <div className="text-center">
              <p className="mb-2">User input</p>
              <div className="bg-purple-100 p-4 w-36 h-24 flex flex-col justify-center">
                <div className="bg-purple-200 h-2 w-full mb-2"></div>
                <div className="bg-purple-200 h-2 w-full mb-2"></div>
                <div className="bg-purple-200 h-2 w-full"></div>
              </div>
            </div>
            
            <div className="text-center mx-4">
              <p className="mb-2">Prompt</p>
              <div className="bg-purple-100 p-4 w-36 flex flex-col items-center">
                <div className="bg-purple-500 text-white p-2 w-full text-center mb-2">Context</div>
                <div className="bg-purple-500 text-white p-2 w-full text-center mb-2">Instructions</div>
                <div className="bg-purple-500 text-white p-2 w-full text-center">Task</div>
              </div>
            </div>
            
            <div className="text-center mx-4">
              <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">LLM</div>
            </div>
            
            <div className="text-center">
              <p className="mb-2">Text output</p>
              <div className="bg-purple-100 p-4 w-36 h-24 flex flex-col justify-center">
                <div className="bg-purple-200 h-2 w-full mb-2"></div>
                <div className="bg-purple-200 h-2 w-full mb-2"></div>
                <div className="bg-purple-200 h-2 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practice Sections */}
      <section className="mb-12">
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <div className="bg-purple-900 text-white py-1 px-4 rounded-full inline-block mb-4">Prompting</div>
          <h2 className="text-3xl font-bold mb-6">Be clear and direct</h2>
          
          <div className="mb-6">
            <div className="bg-red-400 text-white p-4 rounded-lg mb-8">
              <p className="text-xl">"Help me comment this code. Keep the explanations short."</p>
            </div>
            
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <p className="text-xl">"Write comments above each highlighted function. For each function, write 2-3 sentences about the core functionality. Document the key information required for a junior engineer to quickly understand the code."</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <div className="bg-purple-900 text-white py-1 px-4 rounded-full inline-block mb-4">Prompting</div>
          <h2 className="text-3xl font-bold mb-6">Provide Examples</h2>
          
          <div className="mb-6">
            <div className="bg-red-400 text-white p-4 rounded-lg mb-8">
              <p className="text-xl">"Review this code for any improvements I can make."</p>
            </div>
            
            <div className="bg-green-500 text-white p-4 rounded-lg">
              <p className="text-xl">"Review this code according to our @standards_doc.md. @this_file.py is a well-regarded library with similar functionality. Pay close attention to X, Y, Z."</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <div className="bg-purple-900 text-white py-1 px-4 rounded-full inline-block mb-4">Prompting</div>
          <h2 className="text-3xl font-bold mb-6">Clearly define your inputs and outputs</h2>
          
          <div className="mb-6">
            <div className="bg-red-400 text-white p-4 rounded-lg mb-8">
              <p className="text-xl">"Generate test data for this function."</p>
            </div>
            
            <div className="bg-green-500 text-white p-4 rounded-lg mb-8">
              <p className="text-xl">"Generate 10 new pieces of test data for this function. Specifically, I am looking to test for XYZ. Try and include a few edge case naming conventions to increase the robustness of this test. Output the test data in JSON format."</p>
            </div>
            
            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="text-lg font-bold mb-2">Tip: Claude can use XML!</p>
              <p>Use tags like &lt;instructions&gt;, &lt;example&gt;, and &lt;formatting&gt; to clearly separate different parts of your prompt. This prevents Claude from mixing up instructions with examples or context.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Setting Realistic Expectations */}
      <section className="mb-12">
        <div className="flex">
          <div className="bg-purple-900 text-white p-6 w-72">
            <h2 className="text-3xl font-bold mb-2">Setting Realistic Expectations</h2>
            <h3 className="text-2xl font-bold mb-4">AI isn't magic!</h3>
          </div>
          
          <div className="flex-1 p-6">
            <div className="mb-6 flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mr-4">1</div>
              <div>
                <p className="font-bold text-lg">AI is good at some things and bad at others.</p>
                <p>You can't throw all your problems over a wall for AI to solve.</p>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mr-4">2</div>
              <div>
                <p className="font-bold text-lg">The word "assistant" in Coding Assistant is important.</p>
                <p>Cody can help a human developer solve problems. The best results come from carefully guided prompt engineering.</p>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mr-4">3</div>
              <div>
                <p className="font-bold text-lg">Chat uses more powerful models and context than autocomplete.</p>
                <p>Autocomplete is optimized for speed; chat is optimized for power.</p>
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg mr-4">4</div>
              <div>
                <p className="font-bold text-lg">It's iterative.</p>
                <p>You're unlikely to consistently get the right answer in a single chat or autocomplete. The more time you put into well-crafted prompts or iterative chat conversations, the better output you will get.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Good Cody Use Cases */}
      <section className="mb-12">
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-white rounded-full mr-2">
              <span className="text-purple-600 font-bold">⭒ Sourcegraph</span>
            </div>
            <span className="font-semibold">Identifying Code AI Use Cases</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-8">Good Cody Use Case Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-purple-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold mb-4">Code Understanding, Review, Documentation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Understand legacy code</li>
                <li>Understand unfamiliar languages</li>
                <li>Summarize multiple files & docs</li>
                <li>Review your recently written code</li>
                <li>Document code</li>
              </ul>
            </div>
            
            <div className="border border-purple-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold mb-4">Code & Test Generation</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Generate new code</li>
                <li>Generate unit tests</li>
                <li>Generate tests based on existing patterns & tooling</li>
                <li>Scaffold boilerplate code or stub testing data</li>
              </ul>
            </div>
            
            <div className="border border-purple-200 rounded-lg p-6 bg-white">
              <h3 className="text-xl font-bold mb-4">Refactoring</h3>
              <ul className="space-y-2 text-gray-700">
                <li>Fix code inline with a generated suggestion</li>
                <li>Chat to brainstorm new ways of accomplishing a task</li>
                <li>Identify syntax and logical errors</li>
                <li>Analyze code blocks for issues and unhandled errors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer for PDF */}
      <footer className="text-center text-gray-500 mt-12 print:mt-4">
        <p>© 2025 Sourcegraph - Cody Prompting Best Practices Guide</p>
        <p className="text-sm">For more information visit sourcegraph.com/cody</p>
      </footer>

      {/* Print Button - only visible on screen, not in print */}
      <div className="fixed bottom-4 right-4 print:hidden">
        <button 
          onClick={() => window.print()} 
          className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        >
          Save as PDF
        </button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            font-size: 12pt;
          }
          .container {
            max-width: 100%;
            padding: 0;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  );
}