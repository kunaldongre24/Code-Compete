import React, { useEffect, useState } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import axios from "axios";
import "../style/codeEditor.css";
import "../style/problem-statement.css";
import ProfileItem from "./ProfileItem";
import ReactDiffViewer from "react-diff-viewer";
import Spinner from "./Spinner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import Countdown from "./Countdown";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import "react-reflex/styles.css";
import MathJaxComponent from "./MathJaxComponent";
import API_BASE_URL from "../constant/Api_base_url";
import DropdownMenu from "./DropdownMenu";
import { useNavigate } from "react-router-dom";

function CodeEditor(props) {
  const { config, socket, raceId, roomId } = props;
  const [animationParent] = useAutoAnimate();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [running, setRunning] = useState(false);
  const [problemLoading, setProblemLoading] = useState(false);
  const [problemIndex, setProblemIndex] = useState(true);
  const [expandTc, setExpandTc] = useState(false);
  const [submitRes, setSubmitRes] = useState({});
  const [skipping, setSkipping] = useState(false);
  const newStyles = {
    variables: {
      dark: {
        highlightBackground: "#fefed5",
        highlightGutterBackground: "#ffcd3c",
        diffViewerBackground: "transparent",
        removedBackground: "rgba(255,255,255,0.05)",
        wordAddedBackground: "#7D383F",
        wordRemovedBackground: "transparent",
        addedBackground: "rgba(255,255,255,0.05)",
        emptyLineBackground: "rgba(248, 97, 92, 0.078)",
      },
    },
    line: {
      padding: "4px 2px",
    },
    marker: {
      display: "none",
    },
  };

  const [runStatus, setRunStatus] = useState({
    msg: "Not ran yet.",
    status: 2,
  });
  const [problem, setProblem] = useState({});
  const onChange = React.useCallback(
    (val, viewUpdate) => {
      const obj = { val, raceId, problemId: problem._id };
      socket.emit("updateCode", obj);
      setCode(val);
    },
    [problem]
  );
  useEffect(() => {
    getProblem();
  }, []);
  const getProblem = async () => {
    setProblemLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/problemset/getRaceProblemset`,
        config
      );
      if (response.data && response.data.status) {
        setProblemIndex(response.data.problem.index);
        setProblem(response.data.problem.problemSetId);
        setCode(response.data.problem.code);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
    setProblemLoading(false);
  };
  useEffect(() => {
    const elements = document.querySelectorAll("[style]");
    elements.forEach((element) => {
      if (element.style.color === "blue") {
        element.classList.add("blue-color");
      }
    });
  }, [problem]);
  const submitCode = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/compiler/submitCode`,
        { code, problemSetId: problem._id, raceId },
        props.config
      );
      setSubmitRes(response.data);
      if (response && response.data.status) {
        getProblem();
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handleSkip = async () => {
    try {
      setSkipping(true);
      const response = await axios.post(
        `${API_BASE_URL}/problemset/skipProblemset`,
        { problemSetId: problem._id, raceId },
        props.config
      );
      if (response.data.status) {
        getProblem();
      }
      setSkipping(false);
      setExpandTc(true);
    } catch (err) {
      setSkipping(false);
      console.error(err);
    }
  };
  const toggleLine = async (i) => {
    try {
      const elem = document.getElementById("input-pre-" + i);
      if (elem.classList.contains("hide-lines")) {
        elem.classList.remove("hide-lines");
      } else {
        elem.classList.add("hide-lines");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const run = async () => {
    try {
      setRunning(true);
      const response = await axios.post(
        `${API_BASE_URL}/compiler/run`,
        { code, problemSetId: problem._id, raceId },
        props.config
      );
      setRunStatus(response.data);
      setExpandTc(true);
    } catch (err) {
      setRunning(false);
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <header className="code-head">
        <div className="flex__align code-al">
          <div className="flex-log">
            <div className="fheader code-lgo">
              <span>I</span> <span>C</span> <span>C</span> <span>P</span>
            </div>
            <div className="pcn-head">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M200-120v-680h360l16 80h224v400H520l-16-80H280v280h-80Z" />
              </svg>
              Problem {problemIndex}
            </div>
            <div>
              <DropdownMenu skipping={skipping} handleClick={handleSkip} />
            </div>
          </div>
          <Countdown />

          <div className="btn-cnt">
            <button type="button" onClick={() => run()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M320-200v-560l440 280-440 280Z" />
              </svg>
              <div>Run</div>
            </button>
            <button type="button" onClick={() => submitCode()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M440-160H260q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520v-286l64 62 56-56-160-160-160 160 56 56 64-62v286Z" />
              </svg>
              <div>Submit</div>
            </button>
          </div>
        </div>
      </header>

      <div className="code-m-cn">
        <div className={`leaderboard-code`}>
          <ul className="side-container" ref={animationParent}>
            {props.members.map((member) => {
              return (
                <ProfileItem
                  title={member.userId.username}
                  key={member.userId._id}
                  svg={member.userId.svg}
                />
              );
            })}
          </ul>
        </div>
        <ReflexContainer className="editor-container" orientation="vertical">
          <ReflexElement className="problem-container left-pane flx-cn">
            <div className="fix-head">
              <div className="pb-header ">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="18"
                    viewBox="0 -960 960 960"
                    width="18"
                  >
                    <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                  </svg>
                  <div>Description</div>
                </div>
              </div>
            </div>

            <div className="pb-b-c">
              {problemLoading ? (
                <div className="run-msg">
                  <img
                    className="racecar"
                    src={require("../images/racecar.gif")}
                  />
                  <div>Loading problem...</div>
                </div>
              ) : submitRes.msg ? (
                <div>
                  <div className="submit-header">
                    <div className="back-btn" onClick={() => setSubmitRes()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20"
                        viewBox="0 -960 960 960"
                        width="20"
                      >
                        <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                      </svg>
                      <span>Problem Description</span>
                    </div>
                  </div>
                  <div className="pd-15">
                    <div className="code-header ex-pd">
                      <div>
                        <span
                          className={`lg-font ${
                            submitRes.status === 1 ? "success" : "no-success"
                          }`}
                        >
                          {submitRes.msg}
                        </span>
                      </div>
                    </div>
                    {submitRes.stderr ? (
                      <pre className="stderr">{submitRes.stderr}</pre>
                    ) : null}
                    {submitRes.code ? (
                      <CodeMirror
                        value={submitRes.code}
                        extensions={[cpp(), EditorView.lineWrapping]}
                        theme={vscodeDark}
                        className="code-editor viewer"
                        readOnly
                        basicSetup={{
                          lineNumbers: false,
                          highlightActiveLine: false,
                          highlightActiveLineGutter: false,
                          foldGutter: false,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="pb-body problem-statement">
                  <h1>{problem.title}</h1>
                  <div className="flex-opt">
                    <div className="opt">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18"
                        viewBox="0 -960 960 960"
                        width="18"
                      >
                        <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
                      </svg>
                      <div>
                        <div>Time limit: {problem.timeLimit}s</div>
                      </div>
                    </div>
                    <div className="opt">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="18"
                        viewBox="0 -960 960 960"
                        width="18"
                      >
                        <path d="M360-360v-240h240v240H360Zm80-80h80v-80h-80v80Zm-80 320v-80h-80q-33 0-56.5-23.5T200-280v-80h-80v-80h80v-80h-80v-80h80v-80q0-33 23.5-56.5T280-760h80v-80h80v80h80v-80h80v80h80q33 0 56.5 23.5T760-680v80h80v80h-80v80h80v80h-80v80q0 33-23.5 56.5T680-200h-80v80h-80v-80h-80v80h-80Zm320-160v-400H280v400h400ZM480-480Z" />
                      </svg>
                      <div>Memory Limit: {problem.memoryLimit}MB</div>
                    </div>
                  </div>
                  <div className="description">
                    <MathJaxComponent children={problem.description} />
                  </div>
                  <div className="io-cnt">
                    {problem.input_specification ? (
                      <div className="io-desc">
                        <h2>Input</h2>
                        <div>
                          <MathJaxComponent
                            children={problem.input_specification}
                          />
                        </div>
                      </div>
                    ) : null}
                    {problem.output_specification ? (
                      <div className="io-desc">
                        <h2>Output</h2>
                        <div>
                          <MathJaxComponent
                            children={problem.output_specification}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {problem.samples?.map((x, i) => {
                    return (
                      <div className="tc-examples" key={i}>
                        <h2>Example:</h2>
                        <div className="io-container">
                          <div className="head-io">Input</div>
                          <pre
                            className="tc-cnt"
                            dangerouslySetInnerHTML={{ __html: x.input }}
                          ></pre>
                        </div>
                        <div className="io-container">
                          <div className="head-io">Output</div>
                          <pre
                            className="tc-cnt"
                            dangerouslySetInnerHTML={{ __html: x.output }}
                          ></pre>
                        </div>
                      </div>
                    );
                  })}
                  <div>
                    {problem.note ? (
                      <div className="note-cl io-desc">
                        <h2>Note</h2>
                        <MathJaxComponent children={problem.note} />
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
            <div className="pb-footer">
              <div>
                <a
                  href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.problemId}`}
                  target="_blank"
                >
                  Open on codeforces
                </a>
              </div>
            </div>
          </ReflexElement>
          <ReflexSplitter />
          <ReflexElement className="right-pane">
            <ReflexContainer orientation="horizontal">
              <ReflexElement
                className="flx-cn slow-anim"
                flex={expandTc ? 0.3 : 0.68}
              >
                <div
                  onClick={() => {
                    if (runStatus.response && !running) {
                      setExpandTc(false);
                    }
                  }}
                >
                  <div className="fix-head">
                    <div className="pb-header">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24"
                          viewBox="0 -960 960 960"
                          width="24"
                          className="code-svg"
                        >
                          <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
                        </svg>
                        <div>Code</div>
                      </div>
                    </div>
                    <div className="code-header code-cd-header">
                      <div>
                        <select className="lang-sel">
                          <option>C++</option>
                          <option>Java</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="code-body">
                    <CodeMirror
                      value={code}
                      extensions={[cpp(), EditorView.lineWrapping]}
                      theme={vscodeDark}
                      className="code-editor"
                      onChange={onChange}
                    />
                  </div>
                </div>
              </ReflexElement>
              <ReflexSplitter />
              <ReflexElement
                className="bottom-pane slow-anim"
                flex={expandTc ? 0.7 : 0.32}
              >
                <div
                  onClick={() => {
                    if (runStatus.response && !running) {
                      setExpandTc(true);
                    }
                  }}
                >
                  <div className="fixed-head">
                    <div className="pb-header">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="18"
                          viewBox="0 -960 960 960"
                          width="18"
                          className="tc-svg"
                        >
                          <path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                        </svg>
                        <div>Testcases</div>
                      </div>
                    </div>
                  </div>
                  {runStatus.response && !running ? null : (
                    <div className="run-msg">
                      {running ? (
                        <Spinner color="#aaa" />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Layer_1"
                          version="1.1"
                          height="30"
                          viewBox="0 0 160 80"
                        >
                          <g>
                            <rect height="6" width="6" x="62" y="6" />
                            <rect height="6" width="6" x="62" y="60" />
                            <rect height="6" width="6" x="56" y="12" />
                            <rect height="6" width="6" x="56" y="18" />
                            <rect height="6" width="6" x="56" y="24" />
                            <rect height="6" width="6" x="56" y="42" />
                            <rect height="6" width="6" x="56" y="48" />
                            <rect height="6" width="6" x="56" y="54" />
                            <rect height="6" width="6" x="50" y="30" />
                            <rect height="6" width="6" x="50" y="36" />
                            <rect height="6" width="6" x="92" y="60" />
                            <rect height="6" width="6" x="92" y="6" />
                            <rect height="6" width="6" x="98" y="54" />
                            <rect height="6" width="6" x="98" y="48" />
                            <rect height="6" width="6" x="98" y="42" />
                            <rect height="6" width="6" x="98" y="24" />
                            <rect height="6" width="6" x="98" y="18" />
                            <rect height="6" width="6" x="98" y="12" />
                            <rect height="6" width="6" x="104" y="36" />
                            <rect height="6" width="6" x="104" y="30" />
                          </g>
                        </svg>
                      )}
                      <div>{running ? null : "Run the code to see."}</div>
                    </div>
                  )}
                  <div className="scroll-tc">
                    {runStatus.response && !running ? (
                      <div className="pd-10">
                        <div className="code-header ex-pd">
                          <div>
                            Status:{" "}
                            <span
                              className={`${
                                runStatus.status === 1
                                  ? "success"
                                  : "no-success"
                              }`}
                            >
                              {runStatus.msg}
                            </span>
                          </div>
                        </div>
                        {runStatus.stderr ? (
                          <pre className="stderr">{runStatus.stderr}</pre>
                        ) : (
                          runStatus.response.map((item, i) => {
                            return (
                              <div key={i} style={{ marginBottom: 30 }}>
                                <div className="io-container">
                                  <div className="head-io">Input</div>
                                  <pre
                                    onClick={() => toggleLine(i)}
                                    id={"input-pre-" + i}
                                    className="tc-cnt hide-lines"
                                    dangerouslySetInnerHTML={{
                                      __html: item.input,
                                    }}
                                  ></pre>
                                </div>
                                <div className="io-container">
                                  <div className="flex-header-tc">
                                    <div className="head-io">
                                      Expected Output
                                    </div>
                                    <div className="head-io">Your Output</div>
                                  </div>

                                  <ReactDiffViewer
                                    styles={newStyles}
                                    useDarkTheme
                                    key={i}
                                    oldValue={String(item.expectedOutput)}
                                    newValue={String(item.output)}
                                    splitView={true}
                                    hideLineNumbers
                                  />
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
      </div>
    </div>
  );
}
export default CodeEditor;
