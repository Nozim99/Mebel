import { usePatternFormat, NumberFormatBase } from "react-number-format";
import { useState } from "react";

function CardExpiry(props) {
  const { format, ...rest } = usePatternFormat({
    ...props,
    format: "####-##-##",
  });

  const _format = (val) => {
    const year = val.substring(0, 4);
    let month = val.substring(4, 6);
    let day = val.substring(6, 8);

    if (month.length === 1 && month[0] > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      // set the lower and upper boundary
      if (Number(month) === 0) {
        month = `01`;
      } else if (Number(month) > 12) {
        month = "12";
      }
    }

    if (day.length === 1 && day[0] > 3) {
      day = `0${day[0]}`;
    } else if (day.length === 2) {
      // set the lower and upper boundary
      if (Number(day) === 0) {
        day = `01`;
      } else if (Number(day) > 31) {
        day = "31";
      }
    }

    return format(`${year}${month}${day}`);
  };

  return <NumberFormatBase format={_format} {...rest} />;
}

export default function App() {
  const [valuesObj, setValuesObj] = useState({});

  return (
    <div className="App">
      <h3>
        Demo for <code>Card Expiry Field </code>
        <h5>To see the value change, type something in the input field</h5>
      </h3>

      <p>
        <CardExpiry
          mask="_"
          allowEmptyFormatting
          onValueChange={(values, sourceInfo) => {
            setValuesObj(values);
          }}
        />
      </p>
      <hr />
      <code>{JSON.stringify(valuesObj)}</code>
      <hr />
    </div>
  );
}
