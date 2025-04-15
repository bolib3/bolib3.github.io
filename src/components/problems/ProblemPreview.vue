<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
</script>

<template>
  <Tabs default-value="python">
    <TabsList class="grid w-full grid-cols-5">
      <TabsTrigger value="python"> Python </TabsTrigger>
      <TabsTrigger value="matlab"> MatLab </TabsTrigger>
      <TabsTrigger value="julia"> Julia </TabsTrigger>
      <TabsTrigger value="ampl"> AMPL </TabsTrigger>
      <TabsTrigger value="gams"> GAMS </TabsTrigger>
    </TabsList>
    <TabsContent value="python">
      <slot name="python" />
    </TabsContent>
    <TabsContent value="matlab">
      <slot name="matlab" />
    </TabsContent>
    <TabsContent value="julia">
      <slot name="julia" />
    </TabsContent>
    <TabsContent value="ampl">
      <slot name="ampl" />
    </TabsContent>
    <TabsContent value="gams">
      <slot name="gams" />
    </TabsContent>
  </Tabs>
</template>
