<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@vueuse/core';

// Persist the selected language in local storage
// This will allow the user to switch between languages and have their choice remembered
const chosenLanguage = useLocalStorage('chosenLanguage', 'python');
</script>

<template>
  <Tabs v-model="chosenLanguage">
    <TabsList class="grid grid-cols-4">
      <TabsTrigger value="python"> Python </TabsTrigger>
      <TabsTrigger value="matlab"> MatLab </TabsTrigger>
      <TabsTrigger value="gams"> GAMS </TabsTrigger>
      <TabsTrigger value="latex"> LaTeX </TabsTrigger>
    </TabsList>
    <TabsContent value="python">
      <slot name="python" />
    </TabsContent>
    <TabsContent value="matlab">
      <slot name="matlab" />
    </TabsContent>
    <TabsContent value="gams">
      <slot name="gams" />
    </TabsContent>
    <TabsContent value="latex">
      <slot name="latex" />
    </TabsContent>
  </Tabs>
</template>
