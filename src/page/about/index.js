import React, {Component} from "react";
import { connect } from "react-redux";
import TweenMax from 'gsap';
import smoothScroll from "../../_component/scroll";
import { fetchDataBy, fetchDataSuccess } from "../../reducers";
import "../../sass/page/about.scss";

// const usePrevious = (value) => {
//   const ref = useRef();
//   useEffect(() => {
//     ref.current = value;
//   });
//   return ref.current;
// }


class About extends Component {
  static pageName = "about";

  constructor(props) {
    super(props);

    this.pageName = About.pageName;
    this.state = {};
    this.about = null;
    this.smooth = null;
  }

  static actions = () => [fetchDataBy(this.pageName)];

  static pushData = data => fetchDataSuccess(this.pageName, data);

  componentWillMount() {
    if (!this.props.projectsData) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.lang !== this.props.lang) {
      this.props.dispatch(fetchDataBy(this.pageName));
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.page !== 'about' && this.props.page === 'about'){
      let smooth = new smoothScroll("#about #scrollWrap", (s, y, h) => {
      });
      smooth.on();
      smooth.showScrollBar();
      TweenMax.to(this.about, .6, {delay:1,autoAlpha:1});
    }
  }


  render() {
    if(this.props.page !== 'about')
      return false;

    if (this.props.aboutData) {
      const data = this.props.aboutData;

      return(
        <div ref={elem => this.about = elem} id="about">
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
                  {data.introduction}
                  <div id="image"><img src={data.image.thumbnail}/></div>
                </div>

                <ul id="articles">
                  {
                    data.articles.map((value, idx)=>{
                      return (
                        <li key={idx}>
                          <p>{value.name}</p>
                          <span className="detailBtn">More Details</span>
                        </li>
                      )
                    })
                  }
                  <span id="title" className="cap">Articles</span>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    page: state.page,
    aboutData: state.aboutData
  };
};

export default connect(mapStateToProps)(About);
