/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable no-unused-vars */
import { yupResolver } from "@hookform/resolvers/yup"
import { CircularProgress } from "@mui/material"
import { message } from "antd"
import React, { useEffect, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Form, FormFeedback, Input, Label } from "reactstrap"
import * as Yup from "yup"
import { createDumpster, updateDumpster } from "../../api/dumpsterApi"

const schema = Yup.object().shape({
    size: Yup.string().required("Size is required"),
    description: Yup.string().required("Description is required"),
    delivery_price_km: Yup.string().required("Please Enter Price of per km"),
    weight: Yup.string().required("Please Enter weight of Bin"),
    usage: Yup.string().required("Usage is required"),
    price: Yup.number()
        .required("Price is required")
        .typeError("Price must be a number")
        .positive("Price must be greater than zero"),
})

const DumpsterForm = ({ setSelectedItem, setopen, open, onUpdateSuccess, formButton, selectedItem, dumpsterDisable, allDumpsters }) => {
    const [loading, setloading] = useState(false)
    const navigate = useNavigate()

    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    })

    const sizeToDimension = {
        "10-12": "10x10",
        "15-16": "15x15",
        "18-20": "18x18",
        "30": "30x30"
    }

    const onSubmit = async (data) => {
        const dimension = sizeToDimension[data.size] || "";
        const formData = { ...data, dimension };
        setloading(true);
        if (selectedItem) {
            await updateDumpster(selectedItem?._id, formData).then((res) => {
                if (res.status === 201) {
                    message.success('Dumpster updated successfully');
                    setloading(false);
                    setopen(false)
                    setSelectedItem(null)
                    if (onUpdateSuccess) onUpdateSuccess();
                } else {
                    message.error('Failed to update Dumpster');
                    setopen(false)
                    setloading(false);
                }
            }).catch((err) => {
                message.error('Failed to update Dumpster');
                setopen(false)
                setloading(false);
            });
        } else {
            await createDumpster(formData).then((res) => {
                if (res.status === 201) {
                    message.success('Dumpster Created successfully');
                    setloading(false);
                    navigate('/dumpster-list')
                } else {
                    message.error('Failed to create Dumpster');
                    setloading(false);
                }
            }).catch((err) => {
                message.error('Failed to create Dumpster');
                setloading(false);
            });
        }
    }

    useEffect(() => {
        if (selectedItem) {
            setValue("size", selectedItem.size);
            setValue("description", selectedItem.description);
            setValue("price", selectedItem.price);
            setValue("weight", selectedItem.weight);
            setValue("usage", selectedItem.usage);
            setValue("delivery_price_km", selectedItem.delivery_price_km);
        }
    }, [selectedItem, setValue]);

    return (
        <>
            <Form onSubmit={handleSubmit(onSubmit)} className='d-flex form_data flex-column gap-4 w-100'>
                {/* Size Field */}
                <div className="flex gap-2 items-center w-full flex-wrap flex-md-nowrap">
                    {!selectedItem &&
                        <div className="w-100 w-full">
                            <Label className="form-label" for="size">
                                Size
                            </Label>
                            <Controller
                                id="size"
                                name="size"
                                defaultValue=""
                                control={control}
                                render={({ field }) => {
                                    const usedSizes = allDumpsters?.map(dumpster => dumpster?.size);
                                    const availableSizes = ["10-12", "15-16", "18-20", "30"].filter(size => !usedSizes.includes(size));
                                    return (
                                        <Input
                                            type="select"
                                            {...field}
                                            invalid={errors.size && true}
                                        >
                                            <option value="">Select Size</option>
                                            {availableSizes?.map(size => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </Input>
                                    );
                                }}
                            />
                            {errors.size && (
                                <FormFeedback>{errors.size.message}</FormFeedback>
                            )}
                        </div>}
                    <div className="w-100 w-full">
                        <Label className="form-label" for="price">
                            Price
                        </Label>
                        <Controller
                            id="price"
                            name="price"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Price"
                                    invalid={errors.price && true}
                                />
                            )}
                        />
                        {errors.price && (
                            <FormFeedback>{errors.price.message}</FormFeedback>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center w-full flex-wrap flex-md-nowrap">
                    <div className="w-100 w-full">
                        <Label className="form-label" for="delivery_price_km">
                            Price Per Kilometer (Km)
                        </Label>
                        <Controller
                            id="delivery_price_km"
                            name="delivery_price_km"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Price per Km"
                                    invalid={errors.delivery_price_km && true}
                                />
                            )}
                        />
                        {errors.delivery_price_km && (
                            <FormFeedback>{errors.delivery_price_km.message}</FormFeedback>
                        )}
                    </div>
                    <div className="w-100 w-full">
                        <Label className="form-label" for="weight">
                            Weight of Dumpster
                        </Label>
                        <Controller
                            id="weight"
                            name="weight"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Weight"
                                    invalid={errors.weight && true}
                                />
                            )}
                        />
                        {errors.weight && (
                            <FormFeedback>{errors.weight.message}</FormFeedback>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center w-full flex-wrap flex-md-nowrap">
                    <div className="w-100 w-full">
                        <Label className="form-label" for="usage">
                            Usage
                        </Label>
                        <Controller
                            id="usage"
                            name="usage"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="textarea"
                                    placeholder="Usage"
                                    invalid={errors.usage && true}
                                />
                            )}
                        />
                        {errors.usage && (
                            <FormFeedback>{errors.usage.message}</FormFeedback>
                        )}
                    </div>
                    <div className="w-100 w-full">
                        <Label className="form-label" for="description">
                            Description
                        </Label>
                        <Controller
                            id="description"
                            name="description"
                            defaultValue=""
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="textarea"
                                    placeholder="Description"
                                    invalid={errors.description && true}
                                />
                            )}
                        />
                        {errors.description && (
                            <FormFeedback>{errors.description.message}</FormFeedback>
                        )}
                    </div>
                </div>
                <div className="flex justify-end w-full my-3">
                    {dumpsterDisable === true ?
                        <OverlayTrigger
                            placement="bottom"
                            overlay={<Tooltip id="button-tooltip-2">You cannot create more than 4 Dumpsters.</Tooltip>}>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-3 plusJakara_medium bg_secondary text_white text-sm" style={{ width: 'fit-content' }}
                                disabled>
                                Create
                            </button>
                        </OverlayTrigger> :
                        <button disabled={loading} className="px-4 py-2 rounded-3 plusJakara_medium bg_primary text_white" style={{ width: 'fit-content' }} type="submit">
                            {loading ? <CircularProgress size={18} className="text_white" /> : formButton}
                        </button>}
                </div>
            </Form>
        </>
    )
}

export default DumpsterForm
