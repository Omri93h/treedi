import React from "react";
import { Helmet } from "react-helmet";
import "../App.css";

const GoogleDriveButton = ({ Url }) => {
  if (Url)  
  {

    return (<div>
        <Helmet>
        <script
          src="https://apis.google.com/js/platform.js"
          type="text/javascript"
        />
      </Helmet>
        <div
          id="save-to-drive-btn"
          className="g-savetodrive"
          data-src={Url}
          data-filename="File.trdi"
          data-sitename="Treedi"
        >
        </div>
        </div>
        )
  }

    else
    return (
    <div>
        <button>Save To Drive</button>
    </div>)
  ;
};

export default GoogleDriveButton;
