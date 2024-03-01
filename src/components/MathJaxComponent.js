import React, { useEffect } from "react";
import "../style/problem-statement.css";

function MathJaxComponent(props) {
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
    }
  }, [props.children]); // Re-render on children change

  return (
    <>
      <div
        id="mathjax-content"
        dangerouslySetInnerHTML={{ __html: props.children }}
      ></div>
    </>
  );
}

export default MathJaxComponent;
