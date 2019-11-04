import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from "../../../src/reducers";
// import smoothScroll from "./scroll";

import Nav from "../nav";
import Home from "../../page/home";
import Projects from "../../page/projects";
import ProjectSingle from "../../page/single/project";
import About from "../../page/about";

import ThreejsBg from "../ThreejsBg";

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }

const PageWrap = props => {
  // const { imageClickedIdx } = props;
  const bodyWrap = useRef(null);
  // const [scroll, setScroll] = useState(null);
  // const prevProps = usePrevious({imageClickedIdx});
  

  // useEffect(() => {
  //     const smooth = new smoothScroll("#projects", (s, y, h) => {
  //       // onScroll(s, y, h);
  //     });
  //     smooth.on();
  //     smooth.showScrollBar();

  //     // setScroll(smooth);
  //   },[Projects]);

  // useEffect(()=>{
  //   if(props.imageClickedIdx){
  //     if(prevProps.imageClickedIdx !== props.imageClickedIdx){
  //       scroll.hideScrollBar();
  //       scroll.off();
  //     }
  //   }
  // },[props.imageClickedIdx]);

  useEffect(()=>{
    if(props.match.params.lang !== props.lang)
      props.dispatch(updateLanguage(props.match.params.lang));
  },[]);

  return (
    <>
      <Nav {...props} />
      <div ref={bodyWrap} id="bodyWrap" className={`body_wrap ${props.lang}`}>
        <Switch>
          <Route
            exact
            path="/:lang/"
            render={props => {
              return <>
                <Home {...props} />
                <Projects {...props} />
                <ProjectSingle {...props} />
                <About {...props} />
              </>
            }}
          />
          {/* <Route
                        exact
                        path="/:lang/projects/"
                        render={props => <Projects {...props} />}
                    />
                    <Route
                        path="/:lang/project/:title/:page?/"
                        render={props => <ProjectSingle {...props} />}
                    />
                    <Route
                        path="/:lang/page-not-found/"
                        render={props => <PageNotFound {...props} />}
                    />
                    <Redirect from="*" to={"/" + props.lang + "/page-not-found/"} /> */}
        </Switch>
      </div>
      <ThreejsBg {...props} />
    </>
  );
};

const mapStateToProps = state => {
  return { 
    lang: state.lang,
    isStarted: state.isStarted,
    page: state.page
    // imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(PageWrap);
