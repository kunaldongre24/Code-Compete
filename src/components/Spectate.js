import React, { useEffect, useState } from "react";
import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import "../style/codeEditor.css";
import "../style/problem-statement.css";
import ProfileItem from "./ProfileItem";

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import "react-reflex/styles.css";

function Spectate(props) {
  const { socket, raceId, userContext } = props;
  const [code, setCode] = useState([]);
  const [spectateList, setSpectateList] = useState([]);

  useEffect(() => {
    if (spectateList.length > 0) {
      for (let user of spectateList) {
        socket.emit("spectateUser", { id: user.userId._id, raceId }, (res) => {
          setCode((res) => {
            const newCode = res.filter((x) => x.userId !== res.userId);
            newCode.push(res);

            const filteredArr = newCode.filter((obj2) =>
              spectateList.some((obj1) => obj1.userId._id === obj2.userId)
            );
            return filteredArr;
          });
        });
      }
      socket.on("setSpectateUser", (resCode) => {
        setCode((prevCode) => {
          const newCode = prevCode.filter((x) => x.userId !== resCode.userId);
          newCode.push(resCode);

          const filteredArr = newCode.filter((obj2) =>
            spectateList.some((obj1) => obj1.userId._id === obj2.userId)
          );
          return filteredArr;
        });
      });
    }
  }, [socket, spectateList]);
  useEffect(() => {
    const list = props.members
      .filter((x) => x.userId._id !== userContext.details._id)
      .sort((a, b) => a.userId.username.localeCompare(b.userId.username))
      .slice(0, 4);
    setSpectateList(list);
  }, [props.members]);

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
                <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
              </svg>
              Spectating
            </div>
          </div>

          <div className="btn-cnt">
            <button type="button" onClick={() => {}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
              </svg>
              <div>Add</div>
            </button>
          </div>
        </div>
      </header>

      <div className="code-m-cn">
        <div className={`leaderboard-code`}>
          <div className="side-container">
            {props.members.map((member) => {
              return (
                <ProfileItem
                  title={member.userId.username}
                  key={member.userId._id}
                  svg={member.userId.svg}
                />
              );
            })}
          </div>
        </div>
        {code.length > 0 ? (
          <ReflexContainer className="editor-container" orientation="vertical">
            <ReflexElement className="left-pane">
              <ReflexContainer orientation="horizontal">
                <ReflexElement className="flx-cn" flex={1}>
                  <div>
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
                          <div>
                            test
                            {/* {
                              spectateList.filter(
                                (x) => x.userId._id === code[0].userId
                              )[0].userId.username
                            } */}
                          </div>
                        </div>
                      </div>
                      <div className="code-header code-cd-header">
                        <div>
                          <select className="lang-sel" disabled>
                            <option>C++</option>
                            <option>Java</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="code-body">
                      <CodeMirror
                        value={code[0].val}
                        extensions={[cpp(), EditorView.lineWrapping]}
                        theme={vscodeDark}
                        className="code-editor"
                        readOnly
                      />
                    </div>
                  </div>
                </ReflexElement>
                {code.length > 2 && <ReflexSplitter />}

                {code.length > 2 ? (
                  <ReflexElement className="flx-cn" flex={1}>
                    <div>
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
                            <div>Code 2</div>
                          </div>
                        </div>
                        <div className="code-header code-cd-header">
                          <div>
                            <select className="lang-sel" disabled>
                              <option>C++</option>
                              <option>Java</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="code-body">
                        <CodeMirror
                          value={code[2].val}
                          extensions={[cpp(), EditorView.lineWrapping]}
                          theme={vscodeDark}
                          className="code-editor"
                          readOnly
                        />
                      </div>
                    </div>
                  </ReflexElement>
                ) : null}
              </ReflexContainer>
            </ReflexElement>
            {code.length > 1 && <ReflexSplitter />}

            {code.length > 1 ? (
              <ReflexElement className="right-pane">
                <ReflexContainer orientation="horizontal">
                  <ReflexElement className="flx-cn" flex={1}>
                    <div>
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
                            <div>Code 3</div>
                          </div>
                        </div>
                        <div className="code-header code-cd-header">
                          <div>
                            <select className="lang-sel" disabled>
                              <option>C++</option>
                              <option>Java</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="code-body">
                        <CodeMirror
                          value={code[1].val}
                          extensions={[cpp(), EditorView.lineWrapping]}
                          theme={vscodeDark}
                          className="code-editor"
                          readOnly
                        />
                      </div>
                    </div>
                  </ReflexElement>
                  {code.length > 3 && <ReflexSplitter />}
                  {code.length > 3 ? (
                    <ReflexElement className="flx-cn" flex={1}>
                      <div>
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
                              <div>Code 4</div>
                            </div>
                          </div>
                          <div className="code-header code-cd-header">
                            <div>
                              <select className="lang-sel" disabled>
                                <option>C++</option>
                                <option>Java</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="code-body">
                          <CodeMirror
                            value={code[3].val}
                            extensions={[cpp(), EditorView.lineWrapping]}
                            theme={vscodeDark}
                            className="code-editor"
                            readOnly
                          />
                        </div>
                      </div>
                    </ReflexElement>
                  ) : null}
                </ReflexContainer>
              </ReflexElement>
            ) : null}
          </ReflexContainer>
        ) : null}
      </div>
    </div>
  );
}
export default Spectate;
