import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api/stock";

const stockOverviewService = {
  getLowStockReport: (
    threshold,
    page = 0,
    size = 10,
    query = "",
    supplierId = null,
    sortBy = "quantity",
    sortDirection = "asc"
  ) => {
    return axios.get(`${API_BASE_URL}/reports/low-stock`, {
      params: {
        threshold,
        page,
        size,
        query,
        supplierId,
        sortBy,
        sortDirection,
      },
    });
  },

  getFilteredAdequateStockReport: (
    query = "",
    supplierId = null,
    threshold = 5,
    page = 0,
    size = 10,
    sortBy = "quantity",
    sortDirection = "asc"
  ) => {
    return axios.get(`${API_BASE_URL}/reports/adequate-stock`, {
      params: {
        query,
        supplierId,
        threshold,
        page,
        size,
        sortBy,
        sortDirection,
      },
    });
  },

  streamStocks: (onMessage, onError) => {
    const eventSource = new EventSource(`${API_BASE_URL}/stream`);

    eventSource.onmessage = function (event) {
      const stockData = JSON.parse(event.data);
      onMessage(stockData);
    };

    eventSource.onerror = function (err) {
      console.error("EventSource failed: ", err);
      onError(err);
      eventSource.close();
    };

    return eventSource;
  },

  getCriticalStockReport: (
    threshold,
    page = 0,
    size = 10,
    query = "",
    supplierId = null,
    sortBy = "quantity",
    sortDirection = "asc"
  ) => {
    return axios.get(`${API_BASE_URL}/reports/critical-stock`, {
      params: {
        threshold,
        page,
        size,
        query,
        supplierId,
        sortBy,
        sortDirection,
      },
    });
  },

  getOutOfStockReport: (page = 0, size = 10, query = "", supplierId = null) => {
    return axios.get(`${API_BASE_URL}/reports/out-of-stock`, {
      params: {
        page,
        size,
        query,
        supplierId,
      },
    });
  },
};

export default stockOverviewService;
