import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./Infobox.css"

function Infobox({ title,active,isRed , checked, cases, total ,...props }) {
  return (
    <Card className={`infobox ${active && "infobox_selected"} ${checked && "infobox_dark"} ${isRed && "infobox_red"}`} onClick={props.onClick} >
      <CardContent>
        <Typography color="textSecondary" className="infobox_title ">
          {title}
        </Typography>
        <h2 className={`infobox_cases ${!isRed && "infobox_green"}`}>{cases}</h2>
        <Typography className="infobox_total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Infobox;
