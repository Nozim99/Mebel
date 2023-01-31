import { NumberFormatBase, usePatternFormat } from "react-number-format";
import { toast } from "react-toastify";

export const Toast = {
  success: (e) => {
    toast.success(e, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },

  error: (e) => {
    toast.error(e, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  },
};

export const priceFormatter = (e) => {
  const formatter = new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
  });

  return formatter.format(e);
};

export const CardExpiry = (props) => {
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
};
