<template>
  <MainLayout>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
      <div class="breadcrumb-title pe-3">รายงานการใช้ยา</div>
    </div>

    <hr />
    <div class="card border-top border-0 border-4 border-primary">
      <div class="card-body p-4">
        <div class="card-title d-flex align-items-center">
          <div><i class="bx bxs-capsule me-2 font-22 text-primary"></i></div>
          <h5 class="mb-0 text-primary">เลือกช่วงวันที่และชื่อยา</h5>
        </div>
        <hr />

        <form class="row g-3" @submit.prevent="fetchData">
          <div class="col-md-3">
            <label class="form-label">วันที่เริ่มต้น</label>
            <flat-pickr v-model="dateRaw1" :config="config" class="form-control" placeholder="เลือกวันที่เริ่มต้น" />
          </div>

          <div class="col-md-3">
            <label class="form-label">วันที่สิ้นสุด</label>
            <flat-pickr v-model="dateRaw2" :config="config" class="form-control" placeholder="เลือกวันที่สิ้นสุด" />
          </div>

          <div class="col-md-4">
            <label class="form-label">ชื่อยา</label>
            <v-select
              v-model="selectedDrug"
              :options="drugOptions"
              :loading="drugSearchLoading"
              :filterable="false"
              @search="onDrugSearch"
              label="name"
              placeholder="ค้นหาจากชื่อ เช่น Para"
            >
              <template #option="{ name, strength, units }">
                <div v-html="highlightMatch(name, drugSearchQuery)"></div>
                <small class="text-muted">{{ strength }} {{ units }}</small>
              </template>
              <template #no-options="{ search }">
                <span v-if="search.length < 2">พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นหา</span>
                <span v-else>ไม่พบยา "{{ search }}"</span>
              </template>
            </v-select>
          </div>

          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-primary w-100" :disabled="!isValidSearch || loading">
              <i class="bx bx-search-alt me-1" :class="{ 'bx-spin': loading }"></i>
              {{ loading ? 'กำลังค้นหา...' : 'ค้นหา' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ผลการค้นหาแบบสรุป -->
    <div v-if="drugUsageData.length > 0 && !loading" class="alert alert-info mt-3 mx-1">
      <strong>ผลการค้นหา:</strong>
      จำนวน <strong>{{ summary.totalPrescriptions.toLocaleString() }}</strong> ครั้ง,
      จำนวนคน <strong>{{ summary.totalPatients.toLocaleString() }}</strong> คน,
      ค่ารักษา <strong>{{ summary.totalAmount.toLocaleString() }}</strong> บาท,
      จำนวนการใช้ <strong>{{ summary.totalQty.toLocaleString() }}</strong> {{ summary.unit }}
    </div>

    <!-- รายละเอียดและตาราง -->
    <div class="card mt-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0 text-uppercase text-primary">
          <i class="bx bx-list-ul me-1"></i>
          รายละเอียดการใช้ยา
        </h6>
        <button class="btn btn-primary btn-sm" @click="exportToExcel" :disabled="drugUsageData.length === 0">
          <i class="bx bx-export"></i> Export Excel
        </button>
      </div>

      <div class="card-body">
        <EasyDataTable
          v-if="drugUsageData.length > 0"
          :headers="headers"
          :items="drugUsageData"
          :rows-per-page="15"
          table-class="custom-table"
        />
        <div v-else-if="!loading" class="text-muted text-center">ไม่พบข้อมูล กรุณาเลือกวันที่และชื่อยา</div>
        <div v-else class="text-center"><span class="spinner-border"></span> กำลังโหลดข้อมูล...</div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import api from '@/services/api';
import FlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.min.css';
import { Thai } from 'flatpickr/dist/l10n/th.js';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import * as XLSX from 'xlsx';
import API_ROUTES from '@/constants/apiRoutes';

dayjs.locale('th');

export default {
  components: {
    MainLayout,
    flatPickr: FlatPickr,
    vSelect,
    EasyDataTable
  },
  data() {
    return {
      dateRaw1: null,
      dateRaw2: null,
      selectedDrug: null,
      drugOptions: [],
      drugUsageData: [],
      drugSearchLoading: false,
      drugSearchQuery: '',
      loading: false,
      summary: {
        totalPatients: 0,
        totalPrescriptions: 0,
        totalQty: 0,
        totalAmount: 0,
        unit: ''
      },
      headers: [
        { text: 'HN', value: 'hn' },
        { text: 'ชื่อ - สกุล', value: 'ptname' },
        { text: 'อายุ', value: 'age' },
        { text: 'เพศ', value: 'sex' },
        { text: 'วันเกิด', value: 'birthdate' },
        { text: 'วันที่รับยา', value: 'vstdate' },
        { text: 'ชื่อยา', value: 'drug' },
        { text: 'จำนวน', value: 'qty' },
        { text: 'มูลค่า', value: 'sum_price' }
      ],
      config: {
        locale: Thai,
        dateFormat: 'Y-m-d',
        altInput: true,
        altFormat: 'j F Y'
      }
    };
  },
  computed: {
    isValidSearch() {
      return this.dateRaw1 && this.dateRaw2 && this.selectedDrug?.name;
    }
  },
  methods: {
    async onDrugSearch(search, loading) {
      if (search.length < 2) return;
      loading(true);
      this.drugSearchQuery = search;
      try {
        const res = await api.get(API_ROUTES.DRUGITEMS_SEARCH, { params: { q: search } });
        this.drugOptions = res.data?.data || [];
      } catch (err) {
        console.error('Drug search error:', err);
        this.drugOptions = [];
      } finally {
        loading(false);
      }
    },
    highlightMatch(text, query) {
      if (!query) return text;
      return text.replace(new RegExp(`(${query})`, 'gi'), '<mark>$1</mark>');
    },
    async fetchData() {
      this.loading = true;
      try {
        const res = await api.get(API_ROUTES.PHAMACYDRUGS, {
          params: {
            date1: dayjs(this.dateRaw1).format('YYYY-MM-DD'),
            date2: dayjs(this.dateRaw2).format('YYYY-MM-DD'),
            drugName: this.selectedDrug.name
          }
        });

        const data = res.data?.data || [];
        this.drugUsageData = data.map((item, i) => ({
          ...item,
          sequence: i + 1
        }));

        const uniquePatients = new Set(data.map(item => item.hn));
        this.summary = {
          totalPatients: uniquePatients.size,
          totalPrescriptions: data.length,
          totalQty: data.reduce((sum, item) => sum + (item.qty || 0), 0),
          totalAmount: data.reduce((sum, item) => sum + (item.sum_price || 0), 0),
          unit: this.selectedDrug?.units || ''
        };

      } catch (err) {
        alert('โหลดข้อมูลผิดพลาด');
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    exportToExcel() {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(this.drugUsageData);
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `DrugReport_${dayjs().format('YYYYMMDD')}.xlsx`);
    }
  }
};
</script>

<style scoped>
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>
