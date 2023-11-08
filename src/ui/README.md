app-header: Event Producer (emits navigation-related events)
app-events: Event Broker (coordinates and manages the event flow)
app-router: Event Consumer (listens for path change events and decides which component to display)
app-footer: Event Producer or Consumer, depending on whether it emits events or listens for them to update its state.

Event Producer (Publisher): This is a component that emits or generates events. It doesn't necessarily know what will consume the event or what action will be taken as a result.

Event Broker (Mediator): This mediates the event from the producer to the consumer. It can route, filter, or transform events as needed. It decouples the producer from the consumer.

Event Consumer (Subscriber): This component listens for and acts on events. It subscribes to the events it's interested in and defines the actions to take when such events occur.


Events:

requestExamsData
requestStudentsData

requestExamResults
requestStudentById


Files

Styles are defined at the bottom
