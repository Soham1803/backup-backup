"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const formSchema = z.object({
  groupName: z.string().min(1, {
    message: "Please enter a valid group name",
  }),
  groupDescription: z.string().min(1, {
    message: "Please enter a valid group description",
  }),
  groupImage: z.string().min(4, {
    message: "Please enter a valid group image",
  }),
  recAddress: z.string().min(38, {
    message: "Please enter a valid Ethereum address",
  }),
  recAddress2: z.string().min(38, {
    message: "Please enter a valid Ethereum address",
  }),
  recAddress3: z.string().min(38, {
    message: "Please enter a valid Ethereum address",
  }),
});

const InputFormGroupDetails = ({
  setGroupName,
  setGroupDescription,
  setGroupImage,
  setRecAddress,
  setRecAddress2,
  setRecAddress3,
}: {
  setGroupName: React.Dispatch<React.SetStateAction<string>>;
  setGroupDescription: React.Dispatch<React.SetStateAction<string>>;
  setGroupImage: React.Dispatch<React.SetStateAction<string>>;
  setRecAddress: React.Dispatch<React.SetStateAction<string>>;
  setRecAddress2: React.Dispatch<React.SetStateAction<string>>;
  setRecAddress3: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
      groupDescription: "",
      groupImage: "",
      recAddress: "",
      recAddress2: "",
      recAddress3: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setGroupName(values.groupName);
    setGroupDescription(values.groupDescription);
    setGroupImage(values.groupImage);
    setRecAddress(values.recAddress);
    setRecAddress2(values.recAddress2);
    setRecAddress3(values.recAddress3);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="groupName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Group Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public group display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Description</FormLabel>
              <FormControl>
                <Input placeholder="Group Description" {...field} />
              </FormControl>
              <FormDescription>
                This is your public description.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="groupImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Image</FormLabel>
              <FormControl>
                <Input placeholder="Group Image" {...field} />
              </FormControl>
              <FormDescription>
                This is your public group image .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver EthAddress</FormLabel>
              <FormControl>
                <Input placeholder="Receiver EthAddress" {...field} />
              </FormControl>
              <FormDescription>This is group member 1.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver EthAddress</FormLabel>
              <FormControl>
                <Input placeholder="Receiver EthAddress" {...field} />
              </FormControl>
              <FormDescription>This is your group member 2.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recAddress3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver EthAddress</FormLabel>
              <FormControl>
                <Input placeholder="Receiver" {...field} />
              </FormControl>
              <FormDescription>This is your group member 3.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default InputFormGroupDetails;
