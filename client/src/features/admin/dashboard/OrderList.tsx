import { Close, RemoveRedEye } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import agent from "../../../app/api/agent";
import { Order } from "../../../app/models/order";
import OrderDetailed from "../../orders/OrderDetailed";

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);
  const [target, setTarget] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const fetchOrders = useCallback(() => {
    agent.Admin.paidOrders()
      .then((orders) => setOrders(orders))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleMarkOrder(id: number) {
    agent.Admin.orderDelivered(id)
      .then(() => {
        fetchOrders();
      })
      .catch((error) => console.log(error));
    setTarget(0);
  }

  if (open)
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to remove this?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setTarget(0);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleMarkOrder(target);
              setOpen(false);
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );

  if (selectedOrderNumber > 0)
    return (
      <OrderDetailed
        order={orders?.find((o) => o.id === selectedOrderNumber)!}
        setSelectedOrder={setSelectedOrderNumber}
      />
    );

  if (!orders?.length)
    return (
      <Typography variant="h6">No orders to see here Move along</Typography>
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Order number</TableCell>
            <TableCell>User Id</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Order Date</TableCell>
            <TableCell align="right">Order Status</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow
              key={order.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {order.id}
              </TableCell>
              <TableCell>{order.userId}</TableCell>
              <TableCell align="right">$ {order.total}</TableCell>
              <TableCell align="right">
                {order.orderDate.split("T")[0]}
              </TableCell>
              <TableCell align="right">{order.orderStatus}</TableCell>
              <TableCell align="right">
                <Button
                  startIcon={<RemoveRedEye />}
                  color="success"
                  onClick={() => setSelectedOrderNumber(order.id)}
                />
                <Button
                  color="error"
                  startIcon={<Close />}
                  onClick={() => {
                    setOpen(true);
                    setTarget(order.id);
                  }}
                ></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
