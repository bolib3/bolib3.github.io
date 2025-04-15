<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
</script>

<template>
  <Tabs default-value="python" class="w-[400px]">
    <TabsList class="grid w-full grid-cols-5">
      <TabsTrigger value="python"> Python </TabsTrigger>
      <TabsTrigger value="matlab"> MatLab </TabsTrigger>
      <TabsTrigger value="julia"> Julia </TabsTrigger>
      <TabsTrigger value="ampl"> AMPL </TabsTrigger>
      <TabsTrigger value="gams"> GAMS </TabsTrigger>
    </TabsList>
    <TabsContent value="python"> This is python </TabsContent>
    <TabsContent value="matlab"> This is matlab </TabsContent>
    <TabsContent value="julia"> This is julia </TabsContent>
    <TabsContent value="ampl"> This is ampl </TabsContent>
    <TabsContent value="gams"> This is gams </TabsContent>
  </Tabs>
</template>
