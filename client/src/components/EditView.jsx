import {
    Button,
    ClickAwayListener,
    Drawer,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getEditWidgets } from "../js/EditWidgetFactory";
import { SelectWidget } from "../js/SelectWidgetContext";
import CssTextField from "../mui-styled/CssTextField";
import { TabContextProvider } from "../widgets/contexts/TabContext";

import { useSnackbar } from "notistack";

const propertyList = {};

export function EditView(props) {
    const [data, setData] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedWidget, setSelectedWidget] = useState("");

    const { enqueueSnackbar } = useSnackbar();

    useEffect(async () => {
        await new Promise((r) => setTimeout(r, 500));
        await fetch(`/api/get-json/${props.id}`)
            .then((d) => d.json())
            .then((d) => setData(d));
    }, []);

    let widgets = data ? (
        getEditWidgets(data.ui.widget, 0, "hello", data, propertyList)
    ) : (
        <></>
    );

    const getProperties = (property, indx, key, parent = "") => {
        if (typeof property === "object") {
            const keys = Object.keys(property);
            return (
                <Box
                    key={key + "_parent"}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        bgcolor: "primary.main",
                        padding: 2,
                        borderRadius: 2,
                    }}
                >
                    <Typography key={key + "_label"} variant="h6">
                        {key}
                    </Typography>
                    <Box
                        sx={{ display: "flex", justifyContent: "space-evenly" }}
                    >
                        {keys.map((k, indx) =>
                            getProperties(property[k], indx, k, key)
                        )}
                    </Box>
                </Box>
            );
        }
        return (
            <CssTextField
                id={key}
                aria-parent={parent}
                name="appName"
                label={key}
                autoComplete="off"
                placeholder={String(property)}
                type={typeof property}
                defaultValue={property}
                key={"GRIDPROP_" + indx}
                required
            />
        );
    };

    const WidgetForm = (props) => {
        if (!props.properties) return [];
        const keys = Object.keys(props.properties);
        return (
            <Box
                component={"form"}
                onSubmit={(e) => {
                    e.preventDefault();
                    for (let i = 0; i < e.target.length; ++i) {
                        const parent =
                            e.target[
                                i
                            ].parentElement.parentElement.getAttribute(
                                "aria-parent"
                            );

                        if (parent && parent !== "") {
                            if (e.target[i].tagName === "INPUT") {
                                if (e.target[i].type === "number")
                                    propertyList[selectedWidget][parent][
                                        e.target[i].id
                                    ] = Number(e.target[i].value);
                                else
                                    propertyList[selectedWidget][parent][
                                        e.target[i].id
                                    ] = e.target[i].value;
                            }
                        } else {
                            if (e.target[i].tagName === "INPUT") {
                                if (e.target[i].type === "number")
                                    propertyList[selectedWidget][
                                        e.target[i].id
                                    ] = Number(e.target[i].value);
                                else
                                    propertyList[selectedWidget][
                                        e.target[i].id
                                    ] = e.target[i].value;
                            }
                        }
                    }
                    console.log(propertyList);
                }}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    width: "75%",
                    margin: "auto",
                }}
            >
                {keys.map((key, indx) => {
                    return getProperties(props.properties[key], indx, key);
                })}
                <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    sx={{ width: "6rem", margin: "auto" }}
                    onClick={() => {
                        enqueueSnackbar("YAY", { variant: "success" });
                    }}
                >
                    SAVE
                </Button>
            </Box>
        );
    };

    const WidgetInfo = () => {
        return (
            <Drawer
                key="drawer"
                variant="persistent"
                anchor="bottom"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        color: "white",
                        bgcolor: "primary.light",
                        padding: 3,
                    },
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        variant="h4"
                        sx={{ paddingBottom: 3, paddingLeft: 2 }}
                    >
                        {selectedWidget}
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => setDrawerOpen(false)}
                        sx={{
                            minWidth: "2em",
                            width: "2em",
                            padding: 0,
                            height: "2em",
                        }}
                    >
                        <CloseIcon />
                    </Button>
                </Box>
                <WidgetForm properties={propertyList[selectedWidget]} />
            </Drawer>
        );
    };

    return (
        <TabContextProvider>
            <SelectWidget.Provider value={[setSelectedWidget, setDrawerOpen]}>
                <ClickAwayListener onClickAway={() => setDrawerOpen(false)}>
                    <Box
                        sx={{ position: "relative" }}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setDrawerOpen(false);
                        }}
                    >
                        {widgets}
                        <WidgetInfo />
                    </Box>
                </ClickAwayListener>
            </SelectWidget.Provider>
        </TabContextProvider>
    );
}
