<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { ElMessageBox, ElNotification } from 'element-plus';
import axios from 'axios';

const editor = ClassicEditor
const editorData = ref('')
const loading = ref(false)
const editorConfig = {
  image: {
    toolbar: ['imageUpload', 'toggleImageCaption', 'imageTextAlternative'],
    upload: {
      types: ['jpeg', 'png', 'gif', 'bmp'],
      uploadUrl: 'http://127.0.0.1:3333/patient_detail',
    },
  },
};

const props = defineProps<{
  data?: any,
  loading?: boolean,
  patientFormData?: any
}>()

const emit = defineEmits(['close-detail-form','handle-on-click'])

const cancelDetailForm = () => {
  emit('close-detail-form')
}

const handleOnClickDetail = () => {
  emit('handle-on-click')
}

console.log('hehe');

</script>

<template>
  <div>
    <h1>{{ props.data[0].name }}</h1>
    <ckeditor
      :editor="editor"
      v-model="props.patientFormData[0].description"
      :config="editorConfig"
    ></ckeditor>
    <div class="patient-detail-button">
        <el-button @click="cancelDetailForm">Hủy bỏ</el-button>
        <el-button
          type="primary"
          @click="handleOnClickDetail"
          >{{ loading ? '' : 'Lưu' }}</el-button
        >
      </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  font-size: 200%;
}

.patient-detail-button {
  display: flex;
  justify-content: right;
  margin-top: 20px;
}
</style>
