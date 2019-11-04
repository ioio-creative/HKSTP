import React, {useEffect, useRef} from "react";
import { connect } from "react-redux";
import TweenMax from 'gsap';
import smoothScroll from "../../_component/scroll";
import "../../sass/page/about.scss";

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const About = (props) => {
  const prevProps = usePrevious({page: props.page});
  const about = useRef(null);

  useEffect(()=>{
    if(prevProps){
      if(prevProps.page !== 'about' && props.page === 'about'){
        let smooth = new smoothScroll("#about #scrollWrap", (s, y, h) => {
          // if(this.closeBtn)
          //   TweenMax.set(this.closeBtn,{force3D:true, y: Math.max(0, -y)});
        });
        smooth.on();
        smooth.showScrollBar();
        TweenMax.to(about.current, .6, {delay:1,autoAlpha:1});
      }
    }
  },[props.page])

  if(props.page !== 'about')
    return false;

  return (
    <div ref={about} id="about">
      <div id="scrollWrap">
        <div id="wrap">
          <div id="left">
            <h1 className="cap">About</h1>
          </div>
          <div id="right">
            <div id="lineWrap">
              <div id="line"></div>
            </div>
            <div id="hof">
              <h1 className="cap"><span className="blue">HK</span><span className="orange">STP</span></h1>
            </div>
            <div id="intro" className="contentWrap">
              <div className="title">Introduction</div>
              Comprising Science Park, InnoCentre and Industrial Estates, Hong Kong Science & Technology Parks Corporation (HKSTP) is a statutory body dedicated to building a vibrant innovation and technology ecosystem to connect stakeholders.
              <br/><br/>
              Comprising Science Park, InnoCentre and Industrial Estates, Hong Kong Science & Technology Parks Corporation (HKSTP) is a statutory body dedicated to building a vibrant innovation and technology ecosystem to connect stakeholders.
              <br/><br/>
              Comprising Science Park, InnoCentre and Industrial Estates, Hong Kong Science & Technology Parks Corporation (HKSTP) is a statutory body dedicated to building a vibrant innovation and technology ecosystem to connect stakeholders.
              <div id="image"><img src="https://images.unsplash.com/photo-1541079033018-63489731598f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80"/></div>
            </div>

            <ul id="articles">
              <li>
                <p>HKSTP wins Technology/IT Incubator of the Year at International Business Innovation Association Awards</p>
                <span className="detailBtn">More Details</span>
              </li>
              <li>
                <p>HKSTP wins Technology/IT Incubator of the Year at International Business Innovation Association Awards</p>
                <span className="detailBtn">More Details</span>
              </li>
              <span id="title" className="cap">Articles</span>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    page: state.page
    // projectsData: state.projectsData,
    // projectItems: state.projectItems,
    // category: state.category,
    // isStarted: state.isStarted,
    // imageClickedIdx: state.imageClickedIdx
  };
};

export default connect(mapStateToProps)(About);
