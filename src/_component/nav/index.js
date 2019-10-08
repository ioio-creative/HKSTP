import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateLanguage } from "../../reducers";

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // doc: null
    };
  }

  getAnotherLanguage() {
    let currentLang = this.props.lang;
    const location = this.props.location;

    if (this.props.projectSingleData)
      return location.pathname
        .replace(currentLang, currentLang === "zh" ? "en" : "zh")
        .replace(
          this.props.match.params.title,
          this.props.projectSingleData.alternate_languages[0].uid
        );
    else
      return location.pathname.replace(
        currentLang,
        currentLang === "zh" ? "en" : "zh"
      );
  }

  render() {
    const currentLang = this.props.lang;
    return (
      <>
        {/* <Link to={`/${currentLang}/projects/`}>Projects</Link>
        &nbsp; &nbsp; */}
        <div id="logo" className="fixed">
          logo
        </div>
        <div id="touchToStart" className="fixed">
          touch here
        </div>
        <div id="shortDes" className="fixed h6">
          We connect stakeholders, Foster collaboration and Catalyse innovation.
        </div>
        <Link
          id="langBtn"
          className="fixed"
          to={this.getAnotherLanguage()}
          onClick={() =>
            this.props.dispatch(
              updateLanguage(currentLang === "zh" ? "en" : "zh")
            )
          }
        >
          {currentLang === "zh" ? "Eng" : "中"}
        </Link>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.lang,
    projectSingleData: state.projectSingleData
      ? state.projectSingleData[0]
      : null
  };
};

export default connect(mapStateToProps)(Nav);
