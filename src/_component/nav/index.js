import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage, updateCategory, updatePage, updateHideProjects } from "../../reducers";
import { TweenMax, Back } from "gsap";
// import smoothScroll from '../pagewrap/scroll';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.projectNum = null;
    this.categoryWrap = null;
  }

  getAnotherLanguage() {
    let currentLang = this.props.lang;
    const location = this.props.location;

    // if (this.props.projectSingleData)
    //   return location.pathname
    //     .replace(currentLang, currentLang === "zh" ? "en" : "zh");
    // .replace(
    //   this.props.match.params.title,
    //   this.props.projectSingleData.alternate_languages[0].uid
    // );
    // else
    return location.pathname.replace(
      currentLang,
      currentLang === "zh" ? "en" : "zh"
    );
  }

  componentDidMount(){
    if(this.props.data)
      TweenMax.set(this.categoryWrap, {transitionDelay: '2s'});
  }
  
  componentDidUpdate(prevProps){
    if(this.props.data){
      if(prevProps.isStarted !== this.props.isStarted && this.props.isStarted){
        const target = document.querySelector(`#categoryWrap li.active`);
        const offsetLeft = target.offsetLeft;
        TweenMax.set(this.projectNum, {x:offsetLeft+target.offsetWidth/2-this.projectNum.offsetWidth/2});
        setTimeout(()=>{
          this.categoryWrap.setAttribute('style','');
        },2000)
      }

      if(this.props.data['projects']){
        if(prevProps.category === '' && this.props.category === this.props.data['projects'].categories[0].slug)
        {}
        else{
          if(prevProps.category !== this.props.category){
            const idx = this.props.data['projects'].categories.findIndex(v => v.slug === this.props.category)+1;
            const target = document.querySelector(`#categoryWrap li:nth-child(${idx})`);
            const offsetLeft = target.offsetLeft;
            TweenMax.to(this.projectNum, .4, { x:offsetLeft+target.offsetWidth/2-this.projectNum.offsetWidth/2, ease:Back.easeOut.config(1)});
          }
        }
      }

      if(this.props.page !== 'projects')
        TweenMax.to(this.projectNum, .5, { y:'-100%', autoAlpha:0, ease:'Power4.easeIn'});
      else{
        TweenMax.to(this.projectNum, 1, { delay:.6, y:'0%', autoAlpha:1, ease:'Power4.easeOut'});
      }
    }
  }

  onClick = () => {
    this.props.dispatch(
      updateLanguage(this.props.lang === "zh" ? "en" : "zh")
    )
  }

  render() {
    const currentLang = this.props.lang;
    if (this.props.data) {
      const langData = this.props.langData;
      const homeData = this.props.data['home'];
      const projectsData = this.props.data['projects'];
      const globalData = this.props.data['global'];

      return (
        <>
          <div ref={elem => this.hof = elem} id="hof" className={`fixed cap h3 ${!this.props.isStarted ? 'hide' : ''}`}>
          {
            homeData &&
            homeData.title3.split('').map((value, idx)=>{
              return <span key={idx}>{value === " " ? "\u00A0" : value}</span>
            })
          }
          </div>
          <div ref={elem => this.categoryWrap = elem} id="categoryWrap" className={`fixed ${!this.props.isStarted ? 'hide' : this.props.imageClickedIdx !== null ? 'hide' : ''}`}>
            <ul>
            {
              projectsData &&
              projectsData.categories.map((value, idx)=>{
                return <li key={idx} className={this.props.category === value.slug || (this.props.category === '' && idx === 0) ? 'active h3' : 'h3' } 
                onClick={()=> {
                  if(this.props.category !== value.slug)
                    this.props.dispatch(updateCategory(value.slug));

                  if(this.props.page !== 'projects')
                    this.props.dispatch(updatePage('projects'));

                  if(this.props.isHideProjects)
                    this.props.dispatch(updateHideProjects(false))
                }}>
                  {value.name}
                </li>
              })
            }
              <li className="h3" onClick={()=>{if(this.props.page !== 'about') this.props.dispatch(updatePage('about'))}}>{globalData.about}</li>
              <span ref={elem => this.projectNum = elem} id="projectNum">{this.props.projectItems && this.props.projectItems.length}</span>
            </ul>
          </div>
          <div id="logo" className="fixed">
            <svg xmlns="http://www.w3.org/2000/svg" width="180.519" height="57.066" viewBox="0 0 180.519 80.066"><defs><style>{`.cls-1{fill:#ff6c0c;} .cls-2{fill:#002d73;}`}</style></defs><g id="Group_1" data-name="Group 1" transform="translate(55.855 32.918)"><path id="Path_235" d="M70.546 62.319a9.656 9.656 0 0 0 9.663-9.451 9.857 9.857 0 0 0-9.875-9.875h-7.965a2.286 2.286 0 0 1-.212-4.566h17.2a.914.914 0 0 0 .85-.85V31.95a.914.914 0 0 0-.85-.85H62.475a9.834 9.834 0 0 0-9.875 9.769v.106a9.656 9.656 0 0 0 9.663 9.451h8.177a2.267 2.267 0 0 1 2.336 2.23 2.183 2.183 0 0 1-2.124 2.336H53.45a.914.914 0 0 0-.849.85v5.628a.914.914 0 0 0 .849.85z" className="cls-1" transform="translate(-52.6 -30.994)"/><path id="Path_236" d="M108.759 31.106H82.85a.914.914 0 0 0-.85.85v5.628a.914.914 0 0 0 .85.85h8.389a.914.914 0 0 1 .85.849v22.193a.914.914 0 0 0 .85.85h5.628a.914.914 0 0 0 .85-.85V39.283a.914.914 0 0 1 .85-.849h8.389a.914.914 0 0 0 .85-.85V31.85a.807.807 0 0 0-.637-.85.1.1 0 0 1-.106.106" className="cls-1" transform="translate(-50.781 -31)"/><path id="Path_237" d="M129.033 31.1h-16.884a.914.914 0 0 0-.85.85v29.626a.914.914 0 0 0 .85.85h5.628a.914.914 0 0 0 .85-.85V51.382a.914.914 0 0 1 .85-.85h9.769a9.656 9.656 0 0 0 9.663-9.451 9.812 9.812 0 0 0-9.663-9.875c-.106-.106-.106-.106-.212-.106m.212 12h-9.663a.914.914 0 0 1-.85-.849v-2.868a.914.914 0 0 1 .85-.85h9.769a2.357 2.357 0 0 1 2.336 2.336 2.606 2.606 0 0 1-2.442 2.23" className="cls-1" transform="translate(-48.968 -30.994)"/><path id="Path_241" d="M63.537 65.693a.8.8 0 0 0-.106-.531.552.552 0 0 1 .212-.425c1.7-.106 2.867-.212 3.823-.319.212 0 .319.106.319.212l.106.637c.106.212-.106.319-.319.425a4.356 4.356 0 0 1-1.172.108.339.339 0 0 0-.319.319v1.168a.282.282 0 0 0 .319.319h1.062a.282.282 0 0 1 .319.319v.637a.282.282 0 0 1-.319.319H66.4a.282.282 0 0 0-.319.319v1.062l.212-.212a.638.638 0 0 1 .425-.106 11.286 11.286 0 0 0 1.168.956.323.323 0 0 1 0 .425l-.425.425a.323.323 0 0 1-.425 0l-.425-.425a.323.323 0 0 0-.425 0c0 .106-.106.106-.106.212v4.035a.282.282 0 0 1-.319.319h-.631a.282.282 0 0 1-.319-.319v-3.189a.282.282 0 0 0-.319-.319c-.106 0-.212.106-.319.106-.212.319-.319.637-.531.956-.106.106-.319.212-.425.106a.1.1 0 0 1-.106-.106l-.212-.637a.39.39 0 0 1 .106-.319 16.92 16.92 0 0 0 1.595-3.079c.106-.212-.106-.425-.319-.425h-.956a.282.282 0 0 1-.319-.319v-.637a.282.282 0 0 1 .319-.319h1.168a.282.282 0 0 0 .319-.319v-.956a.282.282 0 0 0-.319-.319c-.319 0-.637.106-.849.106 0 .106-.106-.106-.106-.212m4.354 7.327l-.106-.637a.282.282 0 0 1 .319-.319l3.929-.319a.339.339 0 0 0 .319-.319v-7.005a.282.282 0 0 1 .319-.319h.743a.282.282 0 0 1 .319.319v6.8a.282.282 0 0 0 .319.319l.956-.106a.282.282 0 0 1 .319.319v.637a.282.282 0 0 1-.319.319l-1.062.106a.339.339 0 0 0-.319.319v2.655a.282.282 0 0 1-.319.319h-.743a.282.282 0 0 1-.319-.319v-2.449a.282.282 0 0 0-.319-.319l-3.717.319a.339.339 0 0 1-.319-.319m2.336-2.336a18.458 18.458 0 0 0-1.593-1.38c-.106-.106-.212-.319-.106-.425l.425-.425a.638.638 0 0 1 .425-.106c.531.425 1.274.956 1.7 1.274.106.106.212.319.106.425l-.425.531c-.212.212-.425.212-.531.106m.637-3.079a16.252 16.252 0 0 0-1.7-1.38c-.106-.106-.212-.319-.106-.425l.425-.425a.638.638 0 0 1 .425-.106c.637.531 1.274.956 1.805 1.38.106.106.212.212.106.319a.1.1 0 0 1-.106.106l-.425.425a.263.263 0 0 1-.425.106" className="cls-1" transform="translate(-51.963 -28.952)"/><path id="Path_242" d="M94.9 67.192v-.637a.282.282 0 0 1 .319-.319h.849a.282.282 0 0 0 .319-.319v-1.592a.282.282 0 0 1 .319-.319h.637a.282.282 0 0 1 .319.319v1.593a.282.282 0 0 0 .319.319h.637a.282.282 0 0 1 .319.319v.637a.282.282 0 0 1-.319.319h-.638a.282.282 0 0 0-.319.319v1.38c0 .212.212.319.425.319l.531-.106a.424.424 0 0 1 .425.212v.743c0 .106-.106.319-.212.319l-.85.212c-.106 0-.212.212-.212.319v3.292a1.247 1.247 0 0 1-1.062 1.487h-.212a.957.957 0 0 0-.531.106h-.319a.282.282 0 0 1-.319-.319 1.347 1.347 0 0 1-.106-.637.552.552 0 0 1 .212-.425h.637a.406.406 0 0 0 .531-.319v-2.55c0-.212-.212-.319-.425-.319l-.743.212a.552.552 0 0 1-.425-.212L94.9 70.8a.282.282 0 0 1 .319-.319 3.773 3.773 0 0 0 1.062-.212.339.339 0 0 0 .319-.319v-1.909a.282.282 0 0 0-.319-.319h-.85c-.425-.212-.531-.319-.531-.531m4.46-.531v-.637a.282.282 0 0 1 .319-.319h2.336a.282.282 0 0 0 .319-.319v-1.166a.282.282 0 0 1 .319-.319h.637a.282.282 0 0 1 .319.319v1.168a.282.282 0 0 0 .319.319h2.549a.282.282 0 0 1 .319.319v.637a.282.282 0 0 1-.319.319h-2.549a.282.282 0 0 0-.319.319v1.06a.282.282 0 0 0 .319.319h2.018a.282.282 0 0 1 .319.319v.743a.39.39 0 0 1-.106.319 8.625 8.625 0 0 1-2.018 3.079.323.323 0 0 0 0 .425l.106.106a9.013 9.013 0 0 0 2.336.956c.106 0 .212.212.212.319v.106l-.319.637c0 .106-.212.212-.319.212a16.461 16.461 0 0 1-3.079-1.487.2.2 0 0 0-.319 0 19.823 19.823 0 0 1-3.4 1.593.638.638 0 0 1-.425-.106 1.864 1.864 0 0 0-.425-.531v-.106a.263.263 0 0 1 .106-.425h.106a12.686 12.686 0 0 0 2.761-1.168c.106-.106.212-.319.106-.425l-.106-.106a9.227 9.227 0 0 1-1.7-2.761c-.106-.212 0-.319.212-.425l.106-.106h-.425a.282.282 0 0 1-.319-.319V69a.282.282 0 0 1 .319-.319h2.23a.282.282 0 0 0 .319-.319V67.3a.282.282 0 0 0-.319-.319h-2.333c-.106.106-.212 0-.212-.319m4.991 3.292h-2.761a.339.339 0 0 0-.319.319v.106a6.8 6.8 0 0 0 1.38 2.018.323.323 0 0 0 .425 0 5.924 5.924 0 0 0 1.487-2.124c.212-.106 0-.319-.212-.319" className="cls-1" transform="translate(-49.983 -28.964)"/><path id="Path_243" d="M126.6 75.781V64.419c0-.106.106-.319.212-.319h10.938c.106 0 .319.106.319.212v11.363c0 .106-.106.319-.212.319h-.743c-.106 0-.319-.106-.319-.212s-.106-.319-.212-.319H128.3c-.106 0-.319.106-.319.212s-.106.319-.212.319h-.743c-.319 0-.425-.106-.425-.212m1.274-10.406v8.92c0 .106.106.319.212.319h8.283c.106 0 .319-.106.319-.212V65.48c0-.106-.106-.319-.212-.319h-8.283c-.106-.106-.319 0-.319.212m7.964 5.734l.212.212a.323.323 0 0 1 0 .425l-.106.106c-.106.106-.319.212-.425.319s-.212.319-.106.425l.106.106.531.319c.212.106.212.319.106.531l-.212.212a.638.638 0 0 1-.425.106 28.44 28.44 0 0 0-2.548-1.274c-.212-.106-.212-.319-.106-.531l.212-.212c.106-.106.212-.106.425-.106l.531.319c.106.106.212 0 .319-.106a6.068 6.068 0 0 0 .85-.743l.106-.106a.474.474 0 0 1 .531 0M135.2 71h-2.336c-.106 0-.212 0-.212.106l-.319.319a.39.39 0 0 0-.106.319v1.593c.106 0 .212-.106.319-.106a2.338 2.338 0 0 0 .85-.106.552.552 0 0 1 .425.212v.212a.282.282 0 0 1-.319.319c-1.38.212-2.442.319-3.186.425-.212 0-.319-.106-.425-.319l-.106-.212a.552.552 0 0 1 .212-.425c.212 0 .425-.106.637-.106a.339.339 0 0 0 .319-.319v-.106a.282.282 0 0 0-.319-.319h-.212a10.716 10.716 0 0 1-1.593.743c-.106.106-.319 0-.425-.106l-.212-.319a.388.388 0 0 1 .212-.531 14.183 14.183 0 0 0 1.911-.743c.106-.106.212-.319.106-.425A.39.39 0 0 0 130.1 71h-.743a.282.282 0 0 1-.319-.319v-1.59a.282.282 0 0 1 .319-.319h5.628a.282.282 0 0 1 .319.319v1.593c.212.212.106.319-.106.319m-6.159-4.566v-.107a.282.282 0 0 1 .319-.319h2.124a.282.282 0 0 0 .319-.319v-.212a.282.282 0 0 1 .319-.319h.531a.282.282 0 0 1 .319.319v.212a.282.282 0 0 0 .319.319h2.124a.282.282 0 0 1 .319.319v.106a.282.282 0 0 1-.319.319h-2.123a.282.282 0 0 0-.319.319.282.282 0 0 0 .319.319h2.655a.282.282 0 0 1 .319.319v.106a.282.282 0 0 1-.319.319h-7.221a.282.282 0 0 1-.319-.319v-.108a.282.282 0 0 1 .319-.319h2.655a.282.282 0 0 0 .319-.319.282.282 0 0 0-.319-.319h-2.124c-.106 0-.212-.106-.212-.319m1.38 3.4v.106a.282.282 0 0 0 .319.319h3.292a.282.282 0 0 0 .319-.319v-.106a.282.282 0 0 0-.319-.319h-3.292a.282.282 0 0 0-.319.319" className="cls-1" transform="translate(-48.021 -28.952)"/></g><g id="Group_2" data-name="Group 2"><path id="Path_234" d="M36.306 46.71l15.61-15.61H41.51L31.1 41.506l-5.2 5.2 5.2 5.2 10.41 10.519h10.406z" className="cls-2" transform="translate(1.603 1.924)"/><path id="Path_238" d="M20.176 31.1v12H7.327v-12H0v31.219h7.327v-12h12.849v12h7.433V31.1z" className="cls-2" transform="translate(0 1.924)"/><path id="Path_239" d="M11.787 64.1v1.274q-.956.159-2.23.319A21.325 21.325 0 0 1 6.9 65.8v.956h5.309v1.274H8.6a4.435 4.435 0 0 0 1.594 1.17 4.6 4.6 0 0 0 2.018.425v1.487h-.425c-.106 0-.319-.106-.425-.106v4.991H.743V71c-.106 0-.212.106-.425.106a.39.39 0 0 0-.318.109v-1.487a4.309 4.309 0 0 0 2.018-.428 4.435 4.435 0 0 0 1.592-1.165H0v-1.274h5.309v-.956H.319v-1.274H5.84c1.062 0 2.124-.106 3.186-.106a24.8 24.8 0 0 1 2.761-.425M1.7 70.79h8.92a7.107 7.107 0 0 1-3.61-2.442v2.018H5.416v-2.018a6.079 6.079 0 0 1-1.7 1.593 16.34 16.34 0 0 1-2.018.85m.637 2.124h7.434v-.956H2.336v.956zm0 2.018h7.434v-.956H2.336v.956z" className="cls-2" transform="translate(0 3.966)"/><path id="Path_240" d="M34.149 65.162v1.593L31.6 65.693V64.1zm0 3.292v1.593L31.6 68.985v-1.593zM32.98 70.9h1.38a6.692 6.692 0 0 1-.743 3.186A4.63 4.63 0 0 1 31.6 76.1v-2.018a3.319 3.319 0 0 0 .956-1.168 4.309 4.309 0 0 0 .424-2.014m5.2-6.69v.85h2.02v-.85h1.593v.85h1.487v1.38h-1.486v1.16H43.6v1.38h-1.7a1.546 1.546 0 0 0 .637.956 2.023 2.023 0 0 0 1.062.531v1.593l-.637-.319-.637-.319v2.018h-5.1v.85c0 .212.106.319.319.425h4.248a4.452 4.452 0 0 0 1.7-.425v1.38a3.392 3.392 0 0 1-1.487.319h-4.671a1.231 1.231 0 0 1-1.062-.425 1.6 1.6 0 0 1-.425-1.168v-2.013h5.2v-1.168h-4.138v-.106A6.216 6.216 0 0 1 35.1 72.17v-1.593a3.322 3.322 0 0 0 1.062-.531 2.507 2.507 0 0 0 .637-.956H35.1v-1.38h1.805v-1.168h-1.38v-1.38h1.38v-.85l1.274-.106zm-.743 5.947h3.5a4.438 4.438 0 0 1-.425-1.062h-2.541c-.106.212-.106.319-.212.531a.97.97 0 0 1-.319.531m.743-2.549H40.2v-1.172h-2.016z" className="cls-2" transform="translate(1.955 3.966)"/><path id="Path_244" d="M167.262 33.449a5.645 5.645 0 0 0-4.141 1.911 19.488 19.488 0 0 1-4.991-.637 6.055 6.055 0 0 0 .106-1.38 8.253 8.253 0 0 0-2.867-6.159c2.761-5.416 8.92-12.743 11.256-15.5a5.892 5.892 0 0 0 5.84-5.84A5.8 5.8 0 0 0 166.731 0h-.106a5.965 5.965 0 0 0-5.947 5.734 5.51 5.51 0 0 0 .743 2.867c-1.38 4.885-4.566 11.362-7.964 17.309a7.758 7.758 0 0 0-3.186-.637 8 8 0 0 0-6.371 3.186 40.575 40.575 0 0 1-9.557-6.9v-.109a5.522 5.522 0 1 0-5.522 5.522 6.761 6.761 0 0 0 2.867-.743 34.444 34.444 0 0 1 11.15 4.141 7.043 7.043 0 0 0-.531 2.973 8.051 8.051 0 0 0 7.221 7.964 65.05 65.05 0 0 1-.956 16.99 5.624 5.624 0 0 0-2.867 5.1 6 6 0 0 0 12 .106v-.212a5.919 5.919 0 0 0-3.186-5.309 61.535 61.535 0 0 1-2.549-16.99 8.124 8.124 0 0 0 5.416-4.248 47.723 47.723 0 0 1 4.46 2.549 5.546 5.546 0 0 0 11.044-.637 5.6 5.6 0 0 0-5.628-5.2" className="cls-2" transform="translate(7.63)"/></g></svg>
          </div>
          <div id="touchToStart" className={`fixed ${this.props.isStarted ? 'hide' : ''}`}>touch here</div>
          <div id="shortDes" className={`fixed h3 ${this.props.isStarted ? 'hide' : ''}`} dangerouslySetInnerHTML={{__html: homeData.shortDes }}></div>
          <Link id="langBtn"  className="fixed"
            to={this.getAnotherLanguage()}
            onClick={this.onClick}
          >
            {langData && currentLang === "zh" ? langData[0].shortDisplay : langData[1].shortDisplay}
          </Link>
        </>
      );
    }
    return <h1>Loading...</h1>;
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    isStarted: state.isStarted,
    data: state.data ? state.data[state.lang] : null,
    langData: state.langData ? state.langData : null,
    projectItems: state.projectItems,
    category: state.category,
    imageClickedIdx: state.imageClickedIdx,
    page: state.page,
    isHideProjects: state.isHideProjects
  };
};

export default connect(mapStateToProps)(Nav);
