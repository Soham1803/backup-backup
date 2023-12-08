"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import React from "react";

const formSchema = z.object({
  chatid: z.string().min(38, {
    message: "Please enter a valid Ethereum address",
  }),
});

const InputFormChatId = ({
  setValue,
}: {
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatid: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    setValue(values.chatid);
    console.log(values.chatid);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="chatid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Receiver chatId</FormLabel>
              <FormControl>
                <Input placeholder="chatid" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default InputFormChatId;
