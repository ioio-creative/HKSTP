import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import smoothScroll from "./scroll";

import Nav from "../nav";
import Home from "../../page/home";
import Projects from "../../page/projects";
// import ProjectSingle from "../../page/single/project";
// import PageNotFound from "../../page/404";

import ThreejsBg from "../ThreejsBg";

const PageWrap = props => {
  const bodyWrap = useRef(null);

  useEffect(
    () => {
      const smooth = new smoothScroll("#bodyWrap", (s, y, h) => {
        //onScroll(s, y, h);
      });
      smooth.on();
    },
    [bodyWrap]
  );

  return (
    <>
      <Nav {...props} />
      <div ref={bodyWrap} id="bodyWrap" className={`body_wrap ${props.lang}`}>
        <Switch>
          <Route
            exact
            path="/:lang/"
            render={props => (
              <>
                <Home {...props} />
                <Projects {...props} />
              </>
            )}
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
      <ThreejsBg />
    </>
  );
};

const mapStateToProps = state => {
  return { lang: state.lang };
};

export default connect(mapStateToProps)(PageWrap);
